//抓取豆瓣读书中的数据信息
const axios = require("axios").default
const cheerio = require("cheerio")
const Book = require("../models/Book")
//获取豆瓣读书网页的源代码
async function getBooksHTML() {
    const resp = await axios.get("https://book.douban.com/latest")
    console.log(resp)
    return resp.data;
}


//从豆瓣读书中得到一个完整的网页，并从网页中分析出书籍的基本信息，然后得到一本书籍的详情页
async function getBookLinks() {
    const html = await getBooksHTML();
    const $ = cheerio.load(html);
    const achorElements = $("#content .grid-12-12 li a.cover");
    const links = achorElements
    .map((i, ele) => {
        const href = ele.attribs["href"];
        return href;
    })
    .get();
    return links;
}


/**
 * 根据书籍详情页的地址，得到该书籍的详细信息
 * @param {*} detailUrl
 */
async function getBookDetail(detailUrl) {
    const resp = await axios.get(detailUrl);
    const $ = cheerio.load(resp.data);
    const name = $("h1").text().trim();
    const imgurl = $("#mainpic .nbg img").attr("src");
    const spans = $("#info span.pl");
    const authorSpan = spans.filter((i, ele) => {
      return $(ele).text().includes("作者");
    });
    const author = authorSpan.next("a").text();
    const publishSpan = spans.filter((i, ele) => {
      return $(ele).text().includes("出版年");
    });
    const publishDate = publishSpan[0].nextSibling.nodeValue.trim();
    return {
      name,
      imgurl,
      publishDate,
      author,
    };
  }
  
  /**
   * 获取所有的书籍信息
   */
  async function fetchAll() {
    const links = await getBookLinks(); //得到书籍的详情页地址
    const proms = links.map((link) => {
      return getBookDetail(link);
    });
    console.log(1)
    return Promise.all(proms);
  }
  
  /**
   * 得到书籍信息，然后保存到数据库
   */
  // async
   function saveToDB(books) {
    // const books = await fetchAll();
    // console.log(books);
    // await 
    Book.bulkCreate(books);
    console.log("抓取数据并保存到了数据库");
}

// fetchAll().then((books) => {
//       console.log(books);
//   })


const books = [
    {
      name: '春山',
      imgurl: 'https://img1.doubanio.com/view/subject/s/public/s33602848.jpg',
      publishDate: '2020-6-1',
      author: '何大草'
    },
    {
      name: '刚多林的陷落',
      imgurl: 'https://img3.doubanio.com/view/subject/s/public/s33601722.jpg',
      publishDate: '2020-4',
      author: '[英] J. R. R. 托尔金'
    },
    {
      name: '逍遥游',
      imgurl: 'https://img1.doubanio.com/view/subject/s/public/s33641077.jpg',
      publishDate: '2020-5',
      author: '班宇'
    },
    {
      name: '人生删除事务所',
      imgurl: 'https://img3.doubanio.com/view/subject/s/public/s33594233.jpg',
      publishDate: '2020-6',
      author: '[日]本多孝好'
    },
    {
      name: '审查官手记',
      imgurl: 'https://img3.doubanio.com/view/subject/s/public/s33619082.jpg',
      publishDate: '2020-5',
      author: '[葡] 安东尼奥·洛博·安图内斯'
    },
    {
      name: '想成为神的巴士司机',
      imgurl: 'https://img9.doubanio.com/view/subject/s/public/s33620234.jpg',
      publishDate: '2020-5',
      author: '[以色列] 埃特加·凯雷特'
    },
    {
      name: '精灵薇卡：奥伯龙之怒',
      imgurl: 'https://img3.doubanio.com/view/subject/s/public/s33624653.jpg',
      publishDate: '2020-6',
      author: '[法] 托马斯·戴'
    },
    {
      name: '帝国游戏',
      imgurl: 'https://img9.doubanio.com/view/subject/s/public/s33620115.jpg',
      publishDate: '2020-5',
      author: '[智利] 罗贝托·波拉尼奥'
    },
    {
      name: '推理要在本格前',
      imgurl: 'https://img9.doubanio.com/view/subject/s/public/s33621376.jpg',
      publishDate: '2020-4',
      author: '[日] 谷崎润一郎'
    },
    {
      name: '陆王',
      imgurl: 'https://img3.doubanio.com/view/subject/s/public/s33628150.jpg',
      publishDate: '2020-5',
      author: '[日] 池井户润'
    },
    {
      name: '时间之舞',
      imgurl: 'https://img1.doubanio.com/view/subject/s/public/s33618868.jpg',
      publishDate: '2020-5',
      author: '[美] 安 • 泰勒（Anne Tyler）'
    },
    {
      name: '诡计博物馆',
      imgurl: 'https://img3.doubanio.com/view/subject/s/public/s33624662.jpg',
      publishDate: '2020-5-15',
      author: '[日] 大山诚一郎'
    },
    {
      name: '地下室手记',
      imgurl: 'https://img3.doubanio.com/view/subject/s/public/s33638812.jpg',
      publishDate: '2020-5',
      author: '(俄罗斯) 陀思妥耶夫斯基'
    },
    {
      name: '我会在六月六十日回来',
      imgurl: 'https://img9.doubanio.com/view/subject/s/public/s33606295.jpg',
      publishDate: '2020-5',
      author: '[法] 马塞尔·埃梅'
    },
    {
      name: '猫不存在',
      imgurl: 'https://img1.doubanio.com/view/subject/s/public/s33631347.jpg',
      publishDate: '2020-5',
      author: '阿科'
    },
    {
      name: '酒神的玫瑰',
      imgurl: 'https://img3.doubanio.com/view/subject/s/public/s33614621.jpg',
      publishDate: '2020-5-1',
      author: '方悄悄'
    },
    {
      name: '重返美丽新世界',
      imgurl: 'https://img3.doubanio.com/view/subject/s/public/s33621381.jpg',
      publishDate: '2020-5-10',
      author: '[英] 阿道司·赫胥黎'
    },
    {
      name: '剖开您是我的荣幸',
      imgurl: 'https://img1.doubanio.com/view/subject/s/public/s33595098.jpg',
      publishDate: '2020-5',
      author: '[日]皆川博子'
    },
    {
      name: '动物寓言集',
      imgurl: 'https://img1.doubanio.com/view/subject/s/public/s33613369.jpg',
      publishDate: '2020-5-1',
      author: '[阿根廷] 胡里奥·科塔萨尔'
    },
    {
      name: '锥子',
      imgurl: 'https://img3.doubanio.com/view/subject/s/public/s33626212.jpg',
      publishDate: '2020-5',
      author: '[韩] 崔圭硕'
    },
    {
      name: '走出唯一真理观',
      imgurl: 'https://img3.doubanio.com/view/subject/s/public/s33591973.jpg',
      publishDate: '2020-5',
      author: '陈嘉映'
    },
    {
      name: '卡特制造',
      imgurl: 'https://img9.doubanio.com/view/subject/s/public/s33630715.jpg',
      publishDate: '2020-5',
      author: '[英]埃德蒙·戈登'
    },
    {
      name: '不要和你妈争辩',
      imgurl: 'https://img1.doubanio.com/view/subject/s/public/s33610259.jpg',
      publishDate: '2020-4',
      author: '[瑞典] 弗雷德里克·巴克曼'
    },
    {
      name: '什么是民粹主义？',
      imgurl: 'https://img1.doubanio.com/view/subject/s/public/s33615858.jpg',
      publishDate: '2020-5',
      author: '[德]扬-维尔纳·米勒（Jan-Werner Müller）'
    },
    {
      name: '应仁之乱',
      imgurl: 'https://img9.doubanio.com/view/subject/s/public/s33603466.jpg',
      publishDate: '2020-5',
      author: '[日] 吴座勇一'
    },
    {
      name: '认识建筑',
      imgurl: 'https://img3.doubanio.com/view/subject/s/public/s33613612.jpg',
      publishDate: '2020-6',
      author: '[美] 罗伯特·麦卡特'
    },
    {
      name: '耶路撒冷之前的艾希曼',
      imgurl: 'https://img1.doubanio.com/view/subject/s/public/s33624659.jpg',
      publishDate: '2020-4',
      author: '[德]贝蒂娜·施汤内特'
    },
    {
      name: '人类灭绝之后',
      imgurl: 'https://img1.doubanio.com/view/subject/s/public/s33627607.jpg',
      publishDate: '2020-5',
      author: '[英] 杜格尔·狄克逊'
    },
    {
      name: '条顿骑士团',
      imgurl: 'https://img3.doubanio.com/view/subject/s/public/s33643452.jpg',
      publishDate: '2020-5',
      author: '〔美〕威廉·厄本'
    },
    {
      name: '活过，爱过，写过',
      imgurl: 'https://img1.doubanio.com/view/subject/s/public/s33576728.jpg',
      publishDate: '2020-5',
      author: '李银河'
    },
    {
      name: '丝绸之路',
      imgurl: 'https://img9.doubanio.com/view/subject/s/public/s33615145.jpg',
      publishDate: '2020-4',
      author: '[英]魏泓'
    },
    {
      name: '意大利的冬天',
      imgurl: 'https://img9.doubanio.com/view/subject/s/public/s33601116.jpg',
      publishDate: '2020-4-1',
      author: '[法国] 儒勒·米什莱'
    },
    {
      name: '东亚古代的诸民族与国家',
      imgurl: 'https://img1.doubanio.com/view/subject/s/public/s33625387.jpg',
      publishDate: '2020-4',
      author: '(日) 川本芳昭'
    },
    {
      name: '社会学之思（第3版）',
      imgurl: 'https://img9.doubanio.com/view/subject/s/public/s33577216.jpg',
      publishDate: '2020-4',
      author: '[英]齐格蒙·鲍曼'
    },
    {
      name: '德勒兹论音乐、绘画和艺术',
      imgurl: 'https://img3.doubanio.com/view/subject/s/public/s33609373.jpg',
      publishDate: '2020-5',
      author: '[美] 罗纳德·博格'
    },
    {
      name: '人写的历史必须是人的历史吗？',
      imgurl: 'https://img9.doubanio.com/view/subject/s/public/s33602054.jpg',
      publishDate: '2020-4',
      author: '王晴佳'
    },
    {
      name: '人类大瘟疫',
      imgurl: 'https://img3.doubanio.com/view/subject/s/public/s33624642.jpg',
      publishDate: '2020-5-11',
      author: '[英]  马克·霍尼斯鲍姆'
    },
    {
      name: '战争的试炼',
      imgurl: 'https://img3.doubanio.com/view/subject/s/public/s33621450.jpg',
      publishDate: '2020-5',
      author: '[英] 托马斯·阿斯布里奇'
    },
    {
      name: '她们',
      imgurl: 'https://img9.doubanio.com/view/subject/s/public/s33648496.jpg',
      publishDate: '2020-4-26',
      author: '阎连科'
    },
    {
      name: '故土的陌生人',
      imgurl: 'https://img3.doubanio.com/view/subject/s/public/s33644580.jpg',
      publishDate: '2020-5',
      author: '[美] 阿莉·拉塞尔·霍赫希尔德'
    }
]
saveToDB(books);

// Book.bulkCreate(books);