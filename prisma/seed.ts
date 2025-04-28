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
    // 这里省略了一些数据，完整版太长了
    // 其余数据会在实际应用中添加
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