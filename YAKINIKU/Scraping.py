import os

# 顔認識する対象を決定（検索ワードを入力）
SearchName = ["牛タン","ハラミ","カルビ","ロース","ホルモン","牛肉","豚肉","鶏肉"]
# 画像の取得枚数の上限
ImgNumber =200
# CNNで学習するときの画像のサイズを設定（サイズが大きいと学習に時間がかかる）
ImgSize=(250,250)
input_shape=(250,250,3)

import json
from urllib import parse
import requests
from bs4 import BeautifulSoup

class Google:
    def __init__(self):
        self.GOOGLE_SEARCH_URL = 'https://www.google.co.jp/search'
        self.session = requests.session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:57.0) Gecko/20100101 Firefox/57.0'})

    def Search(self, keyword, type='text', maximum=1000):
        '''Google検索'''
        print('Google', type.capitalize(), 'Search :', keyword)
        result, total = [], 0


        query = self.query_gen(keyword, type)

        while True:
            # 検索
            html = self.session.get(next(query)).text



            links = self.get_links(html, type)

            # 検索結果の追加
            if not len(links):
                print('-> No more links')
                break
            elif len(links) > maximum - total:
                result += links[:maximum - total]
                break
            else:
                result += links
                total += len(links)

        print('-> 結果', str(len(result)), 'のlinksを取得しました')
        return result

    def query_gen(self, keyword, type):
        '''検索クエリジェネレータ'''
        page = 0
        while True:
            if type == 'text':
                params = parse.urlencode({
                    'q': keyword,
                    'num': '100',
                    'filter': '0',
                    'start': str(page * 100)})
            elif type == 'image':
                params = parse.urlencode({
                    'q': keyword,
                    'tbm': 'isch',
                    'filter': '0',
                    'ijn': str(page)})

            yield self.GOOGLE_SEARCH_URL + '?' + params
            page += 1

    def get_links(self, html, type):
        '''リンク取得'''
        soup = BeautifulSoup(html, 'lxml')
        if type == 'text':
            elements = soup.select('.rc > .r > a')
            links = [e['href'] for e in elements]
        elif type == 'image':
            elements = soup.select('.rg_meta.notranslate')
            jsons = [json.loads(e.get_text()) for e in elements]
            links = [js['ou'] for js in jsons]
        return links


#画像のURLをgoogle検索から取得する
# インスタンス作成
google = Google()
for name in SearchName:
    # 画像検索
    ImgURLs = google.Search(name, type='image', maximum=ImgNumber)
    # 保存先のディレクトリ作成
    os.makedirs("./Original/"+str(name), exist_ok=True)

    #Originalファイルに画像を保存する
    for i,target in enumerate(ImgURLs): # ImgURLsからtargetに入れる
        try:
            try:
                re = requests.get(target, allow_redirects=False)
                with open("./Original/"+str(name)+'/' + str(i)+'.jpg', 'wb') as f: # imgフォルダに格納
                    f.write(re.content) # .contentにて画像データとして書き込む
            except requests.exceptions.InvalidSchema:
                continue
        except requests.exceptions.ConnectionError:
            continue
        except UnicodeEncodeError:
            continue
        except UnicodeError:
            continue
        except IsADirectoryError:
            continue

print("保存完了しました") # 確認