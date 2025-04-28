import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 清除现有数据
  await prisma.comment.deleteMany();
  await prisma.message.deleteMany();
  await prisma.user.deleteMany();

  console.log("数据库已清空");

  // 创建用户
  const user1 = await prisma.user.create({
    data: {
      name: "李华",
      avatar: "/me.jpeg",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: "漫漫🐟",
      avatar: "/you.jpeg",
    },
  });

  console.log("用户创建成功", { user1, user2 });

  // 导入提供的留言和评论数据
  const messagesData = [
    {
      id: 73,
      author: {
        name: "李华",
        avatar: "/me.jpeg"
      },
      content: "2025快乐🥳🥳🥳",
      createdAt: 1735695781000,
      comments: []
    },
    {
      id: 72,
      author: {
        name: "李华",
        avatar: "/me.jpeg"
      },
      content: "2024年最后一天了，留一句！",
      createdAt: 1735624993000,
      comments: []
    },
    {
      id: 71,
      author: {
        name: "李华",
        avatar: "/me.jpeg"
      },
      content: "耶？",
      createdAt: 1732981315000,
      comments: []
    },
    {
      id: 70,
      author: {
        name: "漫漫🐟",
        avatar: "/you.jpeg"
      },
      content: "生日快乐呀，小沈，要一直一直保持快乐啊",
      createdAt: 1732981256000,
      comments: []
    },
    {
      id: 8962,
      author: {
        name: "李华",
        avatar: "/me.jpeg"
      },
      content: "生日快乐呀[em]e400198[/em]",
      createdAt: 1718695326000,
      comments: []
    },
    {
      id: 743388,
      author: {
        name: "李华",
        avatar: "/me.jpeg"
      },
      content: "[em]e194[/em][em]e197[/em][em]e195[/em]",
      createdAt: 1699977974000,
      comments: []
    },
    {
      id: 25032,
      author: {
        name: "李华",
        avatar: "/me.jpeg"
      },
      content: "生日快乐",
      createdAt: 1688115243000,
      comments: []
    },
    {
      id: 8554,
      author: {
        name: "李华",
        avatar: "/me.jpeg"
      },
      content: "生日快乐[em]e400083[/em]",
      createdAt: 1654912307000,
      comments: []
    },
    {
      id: 651586,
      author: {
        name: "李华",
        avatar: "/me.jpeg"
      },
      content: "2022新年快乐，希望不会忘记我，祝你开开心心每一天！",
      createdAt: 1643674302000,
      comments: []
    },
    {
      id: 783571,
      author: {
        name: "李华",
        avatar: "/me.jpeg"
      },
      content: "踩踩",
      createdAt: 1641417211000,
      comments: []
    },
    {
      id: 945450,
      author: {
        name: "李华",
        avatar: "/me.jpeg"
      },
      content: "[em]e400186[/em][em]e400186[/em][em]e400186[/em]",
      createdAt: 1624349290000,
      comments: [
        {
          id: 779849,
          author: {
            name: "漫漫🐟",
            avatar: "/you.jpeg"
          },
          content: "谢谢",
          createdAt: 1624351543000
        }
      ]
    },
    {
      id: 627625,
      author: {
        name: "李华",
        avatar: "/me.jpeg"
      },
      content: "[em]e173[/em]",
      createdAt: 1552374435000,
      comments: []
    },
    {
      id: 496098,
      author: {
        name: "李华",
        avatar: "/me.jpeg"
      },
      content: "[em]e213[/em]生日快乐[em]e400562[/em][em]e213[/em]",
      createdAt: 1529996296000,
      comments: [
        {
          id: 206235,
          author: {
            name: "漫漫🐟",
            avatar: "/you.jpeg"
          },
          content: "谢谢你👻",
          createdAt: 1529998671000
        }
      ]
    },
    {
      id: 621030,
      author: {
        name: "李华",
        avatar: "/me.jpeg"
      },
      content: "小年。。。。踩一脚[em]e104[/em]",
      createdAt: 1454367030000,
      comments: [
        {
          id: 839025,
          author: {
            name: "漫漫🐟",
            avatar: "/you.jpeg"
          },
          content: "[em]e192[/em][em]e192[/em][em]e192[/em][em]e195[/em][em]e195[/em][em]e195[/em][em]e192[/em][em]e192[/em][em]e192[/em][em]e195[/em][em]e195[/em][em]e195[/em]",
          createdAt: 1454371886000
        }
      ]
    },
    {
      id: 188904,
      author: {
        name: "李华",
        avatar: "/me.jpeg"
      },
      content: "老给我留言，我也回一个吧，16快乐，期末全过。\\n天天开心[em]e400829[/em][em]e400829[/em][em]e400829[/em]",
      createdAt: 1451609461000,
      comments: [
        {
          id: 354760,
          author: {
            name: "漫漫🐟",
            avatar: "/you.jpeg"
          },
          content: "对   期末过过过",
          createdAt: 1451609820000
        }
      ]
    },
    {
      id: 125279,
      author: {
        name: "漫漫🐟",
        avatar: "/you.jpeg"
      },
      content: "16快乐   小鑫子   快快长大[em]e113[/em][em]e113[/em][em]e113[/em]",
      createdAt: 1451609226000,
      comments: [
        {
          id: 542304,
          author: {
            name: "李华",
            avatar: "/me.jpeg"
          },
          content: "[em]e400826[/em][em]e400825[/em][em]e400822[/em][em]e400832[/em][em]e401181[/em][em]e400831[/em][em]e400850[/em][em]e400851[/em][em]e400849[/em][em]e400823[/em][em]e400827[/em][em]e400828[/em][em]e400833[/em][em]e400836[/em][em]e400866[/em][em]e400829[/em]",
          createdAt: 1451605713000
        }
      ]
    },
    {
      id: 486702,
      author: {
        name: "漫漫🐟",
        avatar: "/you.jpeg"
      },
      content: "圣诞快乐[em]e400188[/em][em]e400188[/em][em]e400188[/em]",
      createdAt: 1451035662000,
      comments: [
        {
          id: 716578,
          author: {
            name: "李华",
            avatar: "/me.jpeg"
          },
          content: "快乐，么么哒",
          createdAt: 1451035745000
        }
      ]
    },
    {
      id: 263090,
      author: {
        name: "漫漫🐟",
        avatar: "/you.jpeg"
      },
      content: "平安夜快乐[em]e129[/em][em]e129[/em][em]e129[/em]",
      createdAt: 1450986754000,
      comments: []
    },
    {
      id: 653968,
      author: {
        name: "李华",
        avatar: "/me.jpeg"
      },
      content: "好久没来了，话说你留言板一半的楼都是我盖的[em]e128[/em]想你了来踩踩[em]e144[/em]～一切都好吧[em]e198[/em]",
      createdAt: 1448044209000,
      comments: [
        {
          id: 780456,
          author: {
            name: "漫漫🐟",
            avatar: "/you.jpeg"
          },
          content: "话说你还记得我吗   [em]e141[/em][em]e141[/em][em]e141[/em]  我不好   一点都不好  仿佛高四的生活",
          createdAt: 1448051776000
        }
      ]
    },
    {
      id: 90982,
      author: {
        name: "漫漫🐟",
        avatar: "/you.jpeg"
      },
      content: "简简单单  希望你一直这样    那么单纯",
      createdAt: 1445863097000,
      comments: []
    },
    {
      id: 25703,
      author: {
        name: "漫漫🐟",
        avatar: "/you.jpeg"
      },
      content: "曾经有一件棘手的事情放在我面前，我没有珍惜，等我失去的时候我才后悔莫及，人世间最痛苦的事莫过于此。如果上天能够给我一个再来一次的机会，我会对那个你说出三个字：\"还钱啦\"。如果非要在这笔账上加上一个期限，我希望是……一天内还清！",
      createdAt: 1444940072000,
      comments: [
        {
          id: 110848,
          author: {
            name: "李华",
            avatar: "/me.jpeg"
          },
          content: "[em]e328531[/em]",
          createdAt: 1444940397000
        }
      ]
    },
    {
      id: 443265,
      author: {
        name: "漫漫🐟",
        avatar: "/you.jpeg"
      },
      content: "哈哈  中秋快乐[em]e113[/em][em]e113[/em][em]e113[/em]",
      createdAt: 1443341322000,
      comments: [
        {
          id: 566604,
          author: {
            name: "李华",
            avatar: "/me.jpeg"
          },
          content: "[em]e328513[/em][em]e328513[/em][em]e328513[/em]你也是",
          createdAt: 1443341743000
        }
      ]
    },
    {
      id: 664615,
      author: {
        name: "李华",
        avatar: "/me.jpeg"
      },
      content: "2015年就要到了。曾经拥有的不要忘记，属于自己的不要放弃，辛劳得来的更要珍惜，已经失去的当作回忆，跨年快乐，愿你在2015年一切都能顺顺利利，高考一起加油！",
      createdAt: 1420066898000,
      comments: [
        {
          id: 859208,
          author: {
            name: "漫漫🐟",
            avatar: "/you.jpeg"
          },
          content: "2015,将会是崭新的开始的,一起为高考努力吧.",
          createdAt: 1420074377000
        }
      ]
    },
    {
      id: 562365,
      author: {
        name: "漫漫🐟",
        avatar: "/you.jpeg"
      },
      content: "小鑫子   好好学习吧",
      createdAt: 1410207137000,
      comments: []
    },
    {
      id: 120953,
      author: {
        name: "漫漫🐟",
        avatar: "/you.jpeg"
      },
      content: "这里还有我去年给你发的 中秋快乐呢",
      createdAt: 1410207096000,
      comments: []
    },
    {
      id: 579426,
      author: {
        name: "漫漫🐟",
        avatar: "/you.jpeg"
      },
      content: "月饼节快乐哈  ",
      createdAt: 1410206995000,
      comments: []
    },
    {
      id: 125553,
      author: {
        name: "漫漫🐟",
        avatar: "/you.jpeg"
      },
      content: "中秋快乐",
      createdAt: 1379593362000,
      comments: []
    },
    {
      id: 304374,
      author: {
        name: "漫漫🐟",
        avatar: "/you.jpeg"
      },
      content: "帮你踩踩.还有,踩扁你",
      createdAt: 1374163301000,
      comments: []
    },
    {
      id: 518826,
      author: {
        name: "李华",
        avatar: "/me.jpeg"
      },
      content: "嘿嘿",
      createdAt: 1364066382000,
      comments: []
    },
    {
      id: 618360,
      author: {
        name: "李华",
        avatar: "/me.jpeg"
      },
      content: "呵呵",
      createdAt: 1364062147000,
      comments: [
        {
          id: 816411,
          author: {
            name: "漫漫🐟",
            avatar: "/you.jpeg"
          },
          content: "敢不留呵呵吗",
          createdAt: 1364062620000
        }
      ]
    },
    {
      id: 536407,
      author: {
        name: "李华",
        avatar: "/me.jpeg"
      },
      content: "\\n oooO ↘┏━┓ ↙ Oooo \\n ( 踩)→┃你┃ ←(死 ) \\n  \\ ( →┃√┃ ← ) / \\n　 \\_)↗┗━┛ ↖(_/",
      createdAt: 1363987182000,
      comments: []
    },
    {
      id: 513009,
      author: {
        name: "漫漫🐟",
        avatar: "/you.jpeg"
      },
      content: "踩踩,我够意思吧",
      createdAt: 1363946699000,
      comments: [
        {
          id: 881089,
          author: {
            name: "漫漫🐟",
            avatar: "/you.jpeg"
          },
          content: "傻样",
          createdAt: 1363953017000
        },
        {
          id: 774663,
          author: {
            name: "李华",
            avatar: "/me.jpeg"
          },
          content: "哈哈哈啊[em]e4018[/em] ",
          createdAt: 1363947414000
        },
        {
          id: 496114,
          author: {
            name: "漫漫🐟",
            avatar: "/you.jpeg"
          },
          content: "嘿嘿",
          createdAt: 1363947354000
        },
        {
          id: 134145,
          author: {
            name: "李华",
            avatar: "/me.jpeg"
          },
          content: "够\n[em]e4005[/em]\n",
          createdAt: 1363947201000
        }
      ]
    },
    {
      id: 270560,
      author: {
        name: "漫漫🐟",
        avatar: "/you.jpeg"
      },
      content: "              好好活着吧",
      createdAt: 1360159870000,
      comments: []
    }
  ];

  // 创建所有留言和评论
  for (const messageData of messagesData) {
    const authorId = messageData.author.name === "李华" ? user1.id : user2.id;

    const createdMessage = await prisma.message.create({
      data: {
        id: messageData.id, // 使用原始ID
        content: messageData.content,
        authorId: authorId,
        createdAt: new Date(messageData.createdAt),
      },
    });

    // 创建评论
    if (messageData.comments && messageData.comments.length > 0) {
      for (const commentData of messageData.comments) {
        const commentAuthorId = commentData.author.name === "李华" ? user1.id : user2.id;

        await prisma.comment.create({
          data: {
            id: commentData.id, // 使用原始ID
            content: commentData.content,
            authorId: commentAuthorId,
            messageId: createdMessage.id,
            createdAt: new Date(commentData.createdAt),
          },
        });
      }
    }
  }

  console.log("数据导入完成");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 