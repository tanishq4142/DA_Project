from sklearn.cluster import DBSCAN
from sklearn.neighbors import NearestNeighbors # importing the library
import numpy as np # linear algebra
import pandas as pd # data processing

import sys


Song_Title = ""

lengthh=len(sys.argv)
for i in range(1,lengthh):
    Song_Title+=sys.argv[i]
    if(i!=lengthh-1):
        Song_Title+=" "
print(Song_Title)

dfSongs = pd.read_csv('SpotifySongs.csv')
dfSongs = dfSongs.drop_duplicates(subset=["SongName","ArtistName"])

df_norm = dfSongs.copy()
norm_columns = ["Popularity","Danceability","Energy","Key","Loudness","Mode","Speechiness","Acousticness","Liveness","Valence","Tempo","Duration_ms"]
for column in norm_columns:
    df_norm[column] = (df_norm[column] - df_norm[column].min()) / (df_norm[column].max() - df_norm[column].min())

x=df_norm.copy()
x=x.drop(["SongName","ArtistName"],axis=1)

neighb = NearestNeighbors(n_neighbors=24) # creating an object of the NearestNeighbors class
nbrs=neighb.fit(x) # fitting the data to the object
distances,indices=nbrs.kneighbors(x)
distances = np.sort(distances, axis=0)
distances = distances[:,1]

# cluster the data into three clusters
dbscan = DBSCAN(eps = 0.57, min_samples = 24).fit(x) # fitting the model
DBSCAN_dataset = dfSongs.copy()
DBSCAN_dataset.loc[:,'Cluster'] = dbscan.labels_
labels = dbscan.labels_ # getting the labels

index_queen = DBSCAN_dataset[DBSCAN_dataset['SongName'] == Song_Title].index[0]

index_queen

df2 = DBSCAN_dataset.loc[index_queen,["Cluster"]]
df2.head()
df2=df2[0]

Req_SongNames = DBSCAN_dataset.loc[DBSCAN_dataset['Cluster'] == df2]["SongName"]
for i in Req_SongNames:
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