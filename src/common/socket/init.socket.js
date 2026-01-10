import { Server } from "socket.io";
import { tokenService } from "../../services/token.service.js";
import { prisma } from "../prisma/connect.prisma.js";
import { join } from "path";
import { create } from "domain";
export const initSoket = (httpServer) => {
    const io = new Server(httpServer, { /* options */ });

    io.on("connection", (socket) => {
        //console.log({ socket });
        console.log("sockerId", socket.id);

        socket.on("CREATE_ROOM", async (data, cb) => {
            console.log("CREATE_ROOM", data);

            // targerUserIds : là mảng các userId mà chủ nhân đang muốn nhắn tin 
            const { targetUserIds = [], accessToken, name } = data;

            // userId : là chủ nhân cuộc gọi socket CREATE_ROOM 
            const { userId } = tokenService.verifyAccessToken(accessToken, { ignoreExpiration: true });

            // gom dữ liệu theo dạng set để unique các userId bên trong 
            const userIdSet = new Set([...targetUserIds, userId])

            // chuyển từ set sang  => array 
            const uniqueUserIds = Array.from(userIdSet);

            console.log("uniqueUserIds", uniqueUserIds);

            // xử lí với chatGroup dạng chat 1-1 (mục đích chỉ có 1 nhóm chat 1-1)
            if (uniqueUserIds.length === 2) {

                // kiểm tra xem nhóm chat đó đã tồn tại hay chưa 
                let chatGroupExits = await prisma.chatGroups.findFirst({
                    where: {
                        ChatGroupsMembers: {
                            // some : có ít nhật 1 phần tử [||]
                            // every : tất cả bản ghi (&&)
                            // none : không có bản ghi nào (!=)
                            every: {
                                userId: {
                                    in: uniqueUserIds,
                                },
                            },
                        },
                    },
                })

                // nếu chưa tồn tại thì tạo mới 
                if (!chatGroupExits) {
                    chatGroupExits = await prisma.chatGroups.create({
                        data: {
                            ownerId: userId,
                            ChatGroupsMembers: {
                                createMany: {
                                    data: [
                                        { userId: uniqueUserIds[0] },
                                        { userId: uniqueUserIds[1] },
                                    ]
                                },
                            },
                        },
                    })
                };
                socket.join(`chat${chatGroupExits.id}`);
                cb({
                    status: "success",
                    messgae: "Create Room thành công",
                    data: { chatGroupId: chatGroupExits.id },
                });
            } else {
                // xử lí với chatGroup dạng chat nhóm  (mục đích có nhiều nhóm chat giống nhau)
                const chatGroupExits = await prisma.chatGroups.create({
                    data: {
                        name: name,
                        ownerId: userId,
                        ChatGroupsMembers: {
                            createMany: {
                                data: uniqueUserIds.map((userId) => {
                                    return { userId: userId };
                                }),
                            },
                        },
                    },
                });

                socket.join(`chat${chatGroupExits.id}`);
                cb({
                    status: "success",
                    messgae: "Create Room thành công",
                    data: { chatGroupId: chatGroupExits.id },
                });
            }


        });

        socket.on("JOIN_ROOM", async (data, cb) => {
            console.log("JOIN_ROOM", data);
            const { accessToken, chatGroupId } = data;

            // userId : là chủ nhân cuộc gọi socket CREATE_ROOM 
            const { userId } = tokenService.verifyAccessToken(accessToken, { ignoreExpiration: true });

            socket.join(`chat${chatGroupId}`);
            cb({
                status: "success",
                messgae: "Create Room thành công",
                data: { chatGroupId: chatGroupId },
            })
        })

        socket.on("SEND_MESSAGE", async (data, cb) => {
            console.log("SEND MESSAGE", data);

            const { message, accessToken, chatGroupId } = data;

            // userId : là chủ nhân cuộc gọi socket CREATE_ROOM 
            const { userId } = tokenService.verifyAccessToken(accessToken, { ignoreExpiration: true });

            const createdAt = new Date().toISOString();

            // bắn về FE , nếu trước đó mà xử lí db thì sẽ bị chặn 
            io.to(`chat${chatGroupId}`).emit("SEND_MESSAGE", {
                messageText: message,
                userSender: userId,
                chatGroupId: chatGroupId,
                createdAt: createdAt,
            });

            // sau khi bắn tin nhắn cho FE thì mới xử lí các tác vụ await 
            await prisma.chatMessage.create({
                data:{
                    messageText:message,
                    userIdSender:userId,
                    createdAt:createdAt,
                    chatGroupId:chatGroupId,
                },
            })
        });

    });

};