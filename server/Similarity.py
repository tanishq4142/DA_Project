import numpy as np # linear algebra
import pandas as pd # data processing

import sys


Song_Title = ""

lengthh=len(sys.argv)
for i in range(1,lengthh):
    Song_Title+=sys.argv[i]
    if(i!=lengthh-1):
        Song_Title+=" "

dfSongs = pd.read_csv('SpotifySongs.csv')
dfSongs = dfSongs.drop_duplicates(subset=["SongName","ArtistName"])


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

index_Value=dfSongs[dfSongs['SongName'] == Song_Title].index[0]






# Selecting song and attributes
columns = ['Acousticness','Danceability','Energy','Liveness','Speechiness','Valence']
# Selecting query parameters
func, param = knnQuery, 5 # k=5
# Querying
response = querySimilars(dfSongs, columns, index_Value, func, param)


for idx in response:
    anySong = dfSongs.loc[idx]
    anySongName = anySong["SongName"]
    
    print(anySongName)