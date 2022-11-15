
from sklearn.neighbors import NearestNeighbors # importing the library
import numpy as np # linear algebra
import pandas as pd # data processing
from sklearn.metrics.pairwise import linear_kernel
from sklearn.metrics.pairwise import euclidean_distances
from sklearn.metrics.pairwise import cosine_similarity

import sys


Song_Title = ""

lengthh=len(sys.argv)
for i in range(1,lengthh):
    Song_Title+=sys.argv[i]
    if(i!=lengthh-1):
        Song_Title+=" "

dfSongs = pd.read_csv('SpotifySongs.csv')
dfSongs = dfSongs.drop_duplicates(subset=["SongName","ArtistName"])

df_norm = dfSongs.copy()

norm_columns = ["Popularity","Danceability","Energy","Key","Loudness","Mode","Speechiness","Acousticness","Liveness","Valence","Tempo","Duration_ms"]
for column in norm_columns:
    df_norm[column] = (df_norm[column] - df_norm[column].min()) / (df_norm[column].max() - df_norm[column].min())

df_norm.reset_index(drop=True, inplace=True)
dfSongs.reset_index(drop=True, inplace=True)
df3 = df_norm.copy()
df3 = df3.drop(["SongName","ArtistName"],axis=1)
df3['mean']  = df3.mean(axis =1)
# Finding Out If Song Is Present In DataSet 
def getSongIndex(songName):
    
    bool = dfSongs['SongName'].isin([songName])
    # Getting Index Of Song If Present
    sindex = bool[bool==True].index[0]
    return sindex

songName = Song_Title

linear_kernal = linear_kernel(df3)
euclidian = euclidean_distances(df3)
consine = cosine_similarity(df3)

def recommendation(m_name,model =linear_kernal):
    # default model is linear kernal 
    SongIndex = getSongIndex(m_name)
    score = list(enumerate(model[SongIndex]))
    sim_score = sorted(score,key = lambda x:x[1],reverse = True)
    sim_score = sim_score[1:21]
    Index = [i[0] for i in sim_score]
    return dfSongs["SongName"].iloc[Index]


req_Songs = recommendation(songName,model =consine )
for i in req_Songs:
    found=1
    for x in range(0,len(i)):
        if(ord(i[x])<32 or ord(i[x])>126):
            found=0
            break
        elif(ord(i[x])==34 or ord(i[x])==39 or ord(i[x])==96):
            found=0
            break
    if found==1:
        print(i)