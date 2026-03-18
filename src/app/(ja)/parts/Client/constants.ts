export type PhotoData = {
  caption: string;
  spec: string;
  instagram: string;
  flickr?: string;
  date: string;
} & (
  | {
      src: string;
      width: number;
      height: number;
    }
  | {
      error: string;
    }
);

export const photoDataList: PhotoData[] = [
  {
    src: '/main-asakusabashi.webp',
    caption: '厩橋 隅田川',
    spec: 'NIKKOR Z 24-70mm f/2.8 S + Nikon Z 6',
    instagram: 'CE5_tEUnEB4',
    flickr: 'https://flic.kr/p/2s2LNzh',
    date: '2020.07.19',
    width: 1364,
    height: 908,
  },
  {
    src: '/main-hyotan-onsen.webp',
    caption: 'ひょうたん温泉 第2駐車場前',
    spec: 'NIKKOR Z 24-70mm f/2.8 S + Nikon Z 6',
    instagram: 'DVLf204D0J0',
    date: '2024.12.14',
    width: 1440,
    height: 958,
  },
  {
    src: '/main-kiryucoco.webp',
    caption: '東京ドームシティ',
    spec: 'NIKKOR Z 24-70mm f/2.8 S + Nikon Z 6',
    instagram: 'DVGzOthD2Py',
    date: '2023.09.03',
    width: 1440,
    height: 958,
  },
  {
    src: '/main-tsutsujigaoka.webp',
    caption: '京王線 つつじヶ丘駅',
    spec: 'NIKKOR Z 24-70mm f/2.8 S + Nikon Z 6',
    instagram: 'DVEL5h3j25D',
    flickr: 'https://flic.kr/p/2s26Y3K',
    date: '2023.12.17',
    width: 1440,
    height: 958,
  },
  {
    src: '/main-keishoan.webp',
    caption: '円覚寺 桂昌庵',
    spec: 'NIKKOR Z 24-70mm f/2.8 S + Nikon Z 6',
    instagram: 'Cm9kBgZPF25',
    flickr: 'https://flic.kr/p/2s1UqWi',
    date: '2022.06.21',
    width: 1440,
    height: 1800,
  },
  {
    src: '/main-kamiisonotorii.webp',
    caption: '神磯の鳥居',
    spec: 'NIKKOR Z 24-70mm f/2.8 S + Nikon Z 6',
    instagram: 'CXIGmx_Bob3',
    flickr: 'https://flic.kr/p/2s1tpC5',
    date: '2021.11.06',
    width: 1440,
    height: 958,
  },
  {
    src: '/main-yamanakako.webp',
    caption: '山中湖 花の都公園',
    spec: 'NIKKOR Z 24-70mm f/2.8 S + Nikon Z 6',
    instagram: 'CE9XGAEHfS9',
    date: '2020.08.22',
    width: 1362,
    height: 906,
  },
  {
    src: '/main-minokakeiwa.webp',
    caption: '南伊豆 蓑掛岩',
    spec: 'NIKKOR Z 24-70mm f/2.8 S + Nikon Z 6',
    instagram: 'CE6INpCn9LC',
    date: '2020.08.16',
    width: 1362,
    height: 906,
  },
  {
    src: '/main-shinjuku.webp',
    caption: 'JR新宿駅 甲州街道改札',
    spec: 'NIKKOR Z 24-70mm f/2.8 S + Nikon Z 6',
    instagram: 'CE6Deb7nUx7',
    date: '2020.07.23',
    width: 1362,
    height: 906,
  },
  {
    src: '/main-akihabara.webp',
    caption: 'JR秋葉原駅',
    spec: 'NIKKOR Z 24-70mm f/2.8 S + Nikon Z 6',
    instagram: 'CCzs-IZnC7m',
    date: '2020.07.18',
    width: 1362,
    height: 906,
  },
  {
    src: '/main-ushinshiro.webp',
    caption: '牛代 みずめ桜',
    spec: 'Tamron SP 24-70mm F/2.8 Di VC USD G2 (A032) + FTZ + Nikon Z 6',
    instagram: 'B-616CxH8FE',
    date: '2020.04.05',
    width: 1365,
    height: 909,
  },
  {
    src: '/main-sumidaaquarium.webp',
    caption: 'すみだ水族館',
    spec: '17-35mm F/2.8-4 Di OSD (A037) + FTZ + Nikon Z 6',
    instagram: 'B65DejRnF0i',
    date: '2020.01.03',
    width: 1362,
    height: 906,
  },
  {
    src: '/main-c97.webp',
    caption: 'コミックマーケット97 Day4',
    spec: 'iPhone XS Max',
    instagram: 'B6u8koWnH_-',
    date: '2019.12.31',
    width: 1440,
    height: 960,
  },
  {
    src: '/main-venusfort.webp',
    caption: 'VenusFort',
    spec: '17-35mm F/2.8-4 Di OSD (A037) + FTZ + Nikon Z 6',
    instagram: 'B6qVD7Invry',
    date: '2019.12.28',
    width: 1362,
    height: 906,
  },
  {
    src: '/main-nact.webp',
    caption: '国立新美術館',
    spec: 'Tamron SP 24-70mm F/2.8 Di VC USD G2 (A032) + FTZ + Nikon Z 6',
    instagram: 'B6LKGmvHqff',
    date: '2019.12.17',
    width: 1440,
    height: 957,
  },
  {
    src: '/main-escalator.webp',
    caption: 'リンクスクエア新宿',
    spec: 'Tamron SP 24-70mm F/2.8 Di VC USD G2 (A032) + FTZ + Nikon Z 6',
    instagram: 'B4d9_CPn9M7',
    date: '2019.11.01',
    width: 1440,
    height: 957,
  },
  {
    src: '/main-fujimibashi.webp',
    caption: '富士見橋(東京都)',
    spec: 'Tamron SP 24-70mm F/2.8 Di VC USD G2 (A032) + Nikon D7200',
    instagram: 'B3n_xUcn86N',
    flickr: 'https://flic.kr/p/2s1sYN9',
    date: '2019.10.13',
    width: 1364,
    height: 908,
  },
];
