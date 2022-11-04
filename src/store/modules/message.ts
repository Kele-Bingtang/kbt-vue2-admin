import { VuexModule, Module, Mutation, Action, getModule } from "vuex-module-decorators";
import store from "@/store";
import { hasReadList, recycleList, unreadList } from "@/test/message";

export interface MessageItem {
  id: string;
  title: string;
  content: string;
  createTime: string;
  loading?: boolean;
}

export interface MessageStore {
  unreadList: Array<MessageItem>;
  hasReadList: Array<MessageItem>;
  recycleList: Array<MessageItem>;
}

export interface MessageState {
  message: MessageStore;
}

@Module({ dynamic: true, store, name: "message", namespaced: true })
class Message extends VuexModule implements MessageState {
  public message: MessageStore = {
    unreadList: [],
    hasReadList: [],
    recycleList: [],
  };

  // 获取消息列表，其中包含未读、已读、回收站三个列表
  @Action
  public getMessageList() {
    return new Promise((resolve, reject) => {
      // 模拟请求消息
      this.SET_MESSAGE_UNREAD_LIST(unreadList);
      this.SET_MESSAGE_HAS_READ_LIST(hasReadList);
      this.SET_MESSAGE_RECYCLE_LIST(recycleList);
      resolve("");
    });
  }

  // 把一个未读消息标记为已读
  @Action
  public messageHasRead({ id }: { id: string }) {
    return new Promise((resolve, reject) => {
      this.MOVE_MESSAGE({
        to: "hasReadList",
        from: "unreadList",
        id,
      });
      resolve("");
    });
  }

  // 删除一个已读消息到回收站
  @Action
  public removeReadMessage({ id }: { id: string }) {
    return new Promise((resolve, reject) => {
      this.MOVE_MESSAGE({
        to: "recycleList",
        from: "hasReadList",
        id,
      });
      resolve("");
    });
  }

  // 还原一个已删除消息到已读消息
  @Action
  restoreRecycleMessage({ id }: { id: string }) {
    return new Promise((resolve, reject) => {
      this.MOVE_MESSAGE({
        to: "hasReadList",
        from: "recycleList",
        id,
      });
      resolve("");
    });
  }

  @Mutation
  public SET_MESSAGE_UNREAD_LIST(unreadList: Array<MessageItem>) {
    unreadList = unreadList.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());
    this.message.unreadList = unreadList;
  }
  @Mutation
  public SET_MESSAGE_HAS_READ_LIST(hasReadList: Array<MessageItem>) {
    hasReadList = hasReadList
      .map(item => {
        item.loading = false;
        return item;
      })
      .sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());
    this.message.hasReadList = hasReadList;
  }
  @Mutation
  public SET_MESSAGE_RECYCLE_LIST(recycleList: Array<MessageItem>) {
    recycleList = recycleList
      .map(item => {
        item.loading = false;
        return item;
      })
      .sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());
    this.message.recycleList = recycleList;
  }
  @Mutation
  public MOVE_MESSAGE(messageRoute: {
    to: "hasReadList" | "recycleList";
    from: "unreadList" | "hasReadList" | "recycleList";
    id: string;
  }) {
    let { from, to, id } = messageRoute;
    const index = (this.message as any)[from].findIndex((item: MessageItem) => item.id === id);
    const messageItem = (this.message as any)[from].splice(index, 1)[0];
    messageItem.loading = false;
    (this.message as any)[to].unshift(messageItem);
  }
}

export const MessageModule = getModule(Message);
