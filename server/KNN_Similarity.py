import numpy as np # linear algebra
import pandas as pd
import sys
from sklearn.cluster import KMeans

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


#Song_Title = "Lost"

KNN_dataset = df_norm.copy()
KNN_dataset = KNN_dataset.drop(['SongName','ArtistName'],axis=1)
spotify_clusters = 7
kmeans = KMeans(n_clusters = spotify_clusters, max_iter = 300)

kmeans.fit(KNN_dataset)
labels_vanilla = kmeans.labels_
labels_vanilla

KNN_norm = df_norm.copy()
KNN_norm.loc[:,'Cluster'] = kmeans.labels_


index_Value=KNN_norm[KNN_norm['SongName'] == Song_Title].index[0]

df2 = KNN_norm.loc[index_Value,["Cluster"]]
df2.head()
df2=df2[0]

Req_SongNames = KNN_norm.loc[KNN_norm['Cluster'] == df2]




#dfSongs['SongName'] = dfSongs['SongName'].apply(lambda x: x.replace('"', ''))
def knnQuery(queryPoint, arrCharactPoints, k):
    tmp = arrCharactPoints.copy(deep=True)
    tmp['dist'] = tmp.apply(lambda x: np.linalg.norm(x-queryPoint), axis=1)
    tmp = tmp.sort_values('dist')
    return tmp.head(k).index

def querySimilars(df, columns, idx, func, param):
    arr = df[columns].copy(deep=True)
    queryPoint = arr.loc[idx]
    arr = arr.drop([idx])
    response = func(queryPoint, arr, param)
    return response

#index_Value = int(dfSongs[dfSongs["SongName"]==Song_Title].index.values)
#index_Value=dfSongs[dfSongs['SongName'] == Song_Title].index[0]
index_Value=KNN_norm[KNN_norm['SongName'] == Song_Title].index[0]

df2 = KNN_norm.loc[index_Value,["Cluster"]]
df2.head()
df2=df2[0]


Req_SongNames = KNN_norm.loc[KNN_norm['Cluster'] == df2]

Songs_Cluster = Req_SongNames.shape[0]




# Selecting song and attributes
columns = ['Acousticness','Energy','Key','Valence','Tempo','Mode',
           'Danceability','Duration_ms','Popularity','Speechiness','Liveness','Loudness']
# Selecting query parameters
func, param = knnQuery, 25
# Querying
#response = querySimilars(dfSongs, columns, index_Value, func, param)
response = querySimilars(df_norm, columns, index_Value, func, param)

Song_Names = Req_SongNames['SongName']

if param > Songs_Cluster:
  for i in Song_Names:
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
else:
  for idx in response:
    #anySong = dfSongs.loc[idx]
    anySong = df_norm.loc[idx]
    anySongName = anySong["SongName"]
    
    found=1
    for x in range(0,len(anySongName)):
        if(ord(anySongName[x])<32 or ord(anySongName[x])>126):
            found=0
            break
        elif(ord(anySongName[x])==34 or ord(anySongName[x])==39 or ord(anySongName[x])==96):
            found=0
            break
    if found==1:
        print(anySongName)