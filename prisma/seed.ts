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

  // 创建留言
  const message1 = await prisma.message.create({
    data: {
      content: "2025快乐🥳🥳🥳",
      authorId: user1.id,
      createdAt: new Date(1735695781000),
    },
  });

  const message2 = await prisma.message.create({
    data: {
      content: "2024年最后一天了，留一句！",
      authorId: user1.id,
      createdAt: new Date(1735624993000),
    },
  });

  const message3 = await prisma.message.create({
    data: {
      content: "耶？",
      authorId: user1.id,
      createdAt: new Date(1732981315000),
    },
  });

  const message4 = await prisma.message.create({
    data: {
      content: "生日快乐呀，小沈，要一直一直保持快乐啊",
      authorId: user2.id,
      createdAt: new Date(1732981256000),
    },
  });

  const message5 = await prisma.message.create({
    data: {
      content: "好久没来了，话说你留言板一半的楼都是我盖的[em]e128[/em]想你了来踩踩[em]e144[/em]～一切都好吧[em]e198[/em]",
      authorId: user1.id,
      createdAt: new Date(1448044209000),
    },
  });

  console.log("留言创建成功", { message1, message2, message3, message4, message5 });

  // 创建评论
  const comment1 = await prisma.comment.create({
    data: {
      content: "话说你还记得我吗   [em]e141[/em][em]e141[/em][em]e141[/em]  我不好   一点都不好  仿佛高四的生活",
      authorId: user2.id,
      messageId: message5.id,
      createdAt: new Date(1448051776000),
    },
  });

  console.log("评论创建成功", { comment1 });

  console.log("数据库初始化完成！");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 