import numpy as np # linear algebra
import pandas as pd # data processing
import math
import sys


Song_Title = ""

lengthh=len(sys.argv)
for i in range(1,lengthh):
    Song_Title+=sys.argv[i]
    if(i!=lengthh-1):
        Song_Title+=" "




dfSongs = pd.read_csv('SpotifySongs.csv')

df_norm = dfSongs.copy()
df_norm = df_norm.drop_duplicates(subset=["SongName"])
norm_columns = ["Popularity","Danceability","Energy","Key","Loudness","Mode","Speechiness","Acousticness","Liveness","Valence","Tempo","Duration_ms"]
for column in norm_columns:
    df_norm[column] = (df_norm[column] - df_norm[column].min()) / (df_norm[column].max() - df_norm[column].min())



df3 = df_norm.copy()
df3 = df3.drop(["SongName","ArtistName"],axis=1)
df3.reset_index(drop=True)

df3['mean']  = df3.mean(axis =1)

songName = Song_Title


def getSongIndex(songName):
    
    bool = df_norm['SongName'].isin([songName])
    # Getting Index Of Song If Present
    sindex = bool[bool==True].index[0]
    return sindex

SongIndex = getSongIndex(songName)
centermean = df3.loc[SongIndex,"mean"]
distance = []
#getting Distance OF Song From Our Main Song
for i,val in enumerate (df3['mean']):
   distance.append(math.sqrt( ( (val - centermean) **2 ) ) )
   
topn =[]
donot = False
#finging top least distance Song  
for i in range(0,500):
   val = min(distance) 
   index = distance.index(val)
   distance.remove(val)
   if donot:
       topn.append(index)
   donot = True
   
Req_Songs = dfSongs.iloc[topn]["SongName"]
count =0
for i in Req_Songs:
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