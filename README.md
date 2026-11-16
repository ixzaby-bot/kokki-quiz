# こっきクイズ！ v1.0

5歳前後の子どもが、国旗を見て3つのひらがなの国名から答えを選ぶクイズです。HTML・CSS・Vanilla JavaScriptで動作し、ビルドや実行時の外部ライブラリは不要です。

## パソコンで遊ぶ

Python 3をインストールし、このフォルダで次を実行します。

```sh
python -m http.server 8000 --bind 127.0.0.1
```

ブラウザで [こっきクイズを開く](http://127.0.0.1:8000/)。WindowsでPythonランチャーを使う場合は `python` を `py -3` に置き換えます。サーバーは Ctrl+C で終了できます。スマートフォンから遊ぶ場合は、次の手順で公開したHTTPSのURLを開きます。

## GitHub Pagesで公開する

1. GitHubに公開リポジトリを作成し、このフォルダの内容を `main` ブランチへアップロードします。リポジトリの直下に `index.html` がある構成にします。
2. リポジトリの **Settings → Pages** を開き、**Build and deployment → Source → Deploy from a branch** を選びます。
3. **main** と **/(root)** を選んで **Save** を押します。
4. デプロイ完了後、Pages設定に表示される **Visit site** を開きます。プロジェクト用URLの形式は `https://ユーザー名.github.io/リポジトリ名/` です。

公開方法の詳細は [GitHub Pages公式ガイド](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) にあります。

## 遊び方とオフライン

- 国名をタップすると、正解には「○」、選んだ誤答には「×」が付きます。間違えたときは正しい国名も表示します。「つぎのもんだい」で次へ進みます。
- 右上で難易度を変更できます。「かんたん」は20か国、「ふつう」はその20か国を含む60か国、「せかい」「ちょうむずかしい」は全195か国です。20・60か国はアプリ独自の選定で、対象コードは `quiz.mjs` にあります。
- 「ちょうむずかしい」は似た配色・図柄の国を優先し、続いて同じ小地域・地域の国から誤答候補を選びます。
- 各難易度で一巡すると順番を再抽選します。正解数は一巡後も引き継ぎます。難易度変更と再読み込みで正解数・連続正解数は0に戻ります。
- 初回はオンラインで開き、画面下に「✓ オフラインでも あそべるよ」と出るまで待ちます。以後は同じブラウザで同じURLを開くと、通信を切っても全難易度で遊べます。端末側でサイトデータを削除した場合は再取得が必要です。
- ホーム画面への追加はiPhoneのSafariでは共有メニュー、Androidでは対応ブラウザのメニューから行えます。アプリのファイルを更新して公開するときは `sw.js` のキャッシュバージョンも変更してください。

## データと素材

- `data/countries.json` に国連加盟193か国、バチカン（聖座）、パレスチナの計195件を収録しています。`code` はISO 3166-1 alpha-2の小文字、`officialName` は正式名称、`name` は子ども向け表示名、`region` と `subregion` は地域と小地域、`flag` はローカルSVGへの相対パスです。
- 国旗は **flag-icons 7.3.2** の4対3版SVGを195枚選び、`assets/flags/` に同梱しました。Copyright © 2013 Panayiotis Lipiridis、MIT License。配布元の縦横比に統一した教材用画像です。[取得元](https://registry.npmjs.org/flag-icons/-/flag-icons-7.3.2.tgz) · [プロジェクト](https://github.com/lipis/flag-icons) · [同梱ライセンス原文](licenses/flag-icons.txt)
- 国データは **mledoze/countries** から抽出し、日本語表記の調整、ひらがなへの変換、国旗パスの追加を行いました。派生データベース `data/countries.json` は Open Database License 1.0 で提供します。[元データ](https://github.com/mledoze/countries/blob/master/countries.json) · [ODbL 1.0](https://opendatacommons.org/licenses/odbl/1-0/)
- アプリアイコンと背景イラストはこのアプリ用に作成しています。

## テスト結果

| 確認内容 | 実施結果 |
| --- | --- |
| 国・表示名・パスの一意性、全参照先のSVGの存在 | 195件すべて合格 |
| 正解を1つ含む重複なしの三択、一巡内の重複なし | 4難易度を各2巡、計940問で合格 |
| 二重採点防止、連続正解、不正解時のリセット | 合格 |
| 難易度変更、正誤表示、次の問題へのタップ操作 | ブラウザで4難易度とも合格 |
| 横スクロールの有無 | 幅320・375・390 CSS pxの縦画面で合格 |
| オフラインでの再読み込みとSVGのデコード | リポジトリ名付きURLを模した配信先で、195枚すべて合格 |

画面操作はWindows版Edgeのモバイルエミュレーションで確認しました。iPhone・Androidの実機での確認は未実施です。

### 再実行

Node.js 20以降で、フォルダ直下から次を実行します。

```sh
node --test tests/quiz.test.mjs
```

ブラウザテストには開発用のPlaywrightとChromiumを使用します。テストは一時的にローカルサーバーを起動し、終了時に閉じます。

```sh
npm install --no-save --package-lock=false playwright
npx playwright install chromium
node tests/browser.cjs
```

既存のEdgeを使用する場合は、環境変数 `BROWSER_PATH` に実行ファイルのフルパスを指定できます。
