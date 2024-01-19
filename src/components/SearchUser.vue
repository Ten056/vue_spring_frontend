<template>
  <div class="flex flex-col items-center justify-center my-8">
    <h1 class="text-2xl font-semibold text-gray-800">ユーザ管理画面</h1>
  </div>
  <div class="max-w-md mx-auto p-6 bg-white shadow-md rounded">
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="lastName">
        名字
      </label>
      <input
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="lastName"
        type="text"
        v-model="user.lastName"
      />
      <p class="text-red-500 text-xs italic" v-if="errMsgs.lastName">
        {{ errMsgs.lastName }}
      </p>
    </div>
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="firstName">
        名前
      </label>
      <input
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="firstName"
        type="text"
        v-model="user.firstName"
      />
      <p class="text-red-500 text-xs italic" v-if="errMsgs.firstName">
        {{ errMsgs.firstName }}
      </p>
    </div>
    <div class="mb-6">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
        Email
      </label>
      <input
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
        id="email"
        type="email"
        v-model="user.email"
      />
      <p class="text-red-500 text-xs italic" v-if="errMsgs.email">
        {{ errMsgs.email }}
      </p>
    </div>
    <div class="flex items-center justify-end">
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        type="button"
        @click="createUserLocal"
      >
        作成
      </button>
    </div>
  </div>
  <div class="mt-8 mx-8 mb-4">
    <table class="min-w-full bg-white">
      <thead class="bg-gray-800 text-white">
        <tr>
          <th class="text-left py-3 px-4 uppercase font-semibold text-sm">
            名字
          </th>
          <th class="text-left py-3 px-4 uppercase font-semibold text-sm">
            名前
          </th>
          <th class="text-left py-3 px-4 uppercase font-semibold text-sm">
            メールアドレス
          </th>
          <th
            class="text-left py-3 px-4 uppercase font-semibold text-sm text-center"
          >
            削除
          </th>
        </tr>
      </thead>
      <tbody class="text-gray-700">
        <tr v-for="data in allData" :key="data.id">
          <td class="py-3 px-4 w-1/4">
            <div class="flex justify-between items-center">
              <template v-if="editId === data.id">
                <input
                  type="text"
                  :class="`edit-input-${data.id}-ln`"
                  v-model="editableUser.lastName"
                  class="w-4/5"
                  @keydown.enter="handleEnter(data.id, $event)"
                />
                <button @click="updateUserLocal(data.id)" class="ml-2">
                  <img src="/save.png" class="w-4" alt="save" />
                </button>
              </template>
              <template v-else>
                <div @click="editUser(data, 'ln')" class="w-4/5 cursol-pointer">
                  {{ data.lastName }}
                </div>
                <button @click="editUser(data, 'ln')" class="ml-2">
                  <img src="/edit.png" class="w-4" alt="edit" />
                </button>
              </template>
            </div>
          </td>
          <td class="py-3 px-4 w-1/4">
            <div class="flex justify-between items-center">
              <template v-if="editId === data.id">
                <input
                  type="text"
                  :class="`edit-input-${data.id}-fn`"
                  v-model="editableUser.firstName"
                  class="w-4/5"
                  @keydown.enter="handleEnter(data.id, $event)"
                />
                <button @click="updateUserLocal(data.id)" class="ml-2">
                  <img src="/save.png" class="w-4" alt="save" />
                </button>
              </template>
              <template v-else>
                <div @click="editUser(data, 'fn')">
                  {{ data.firstName }}
                </div>
                <button @click="editUser(data, 'fn')" class="ml-2">
                  <img src="/edit.png" class="w-4" alt="edit" />
                </button>
              </template>
            </div>
          </td>
          <td class="py-3 px-4 w-1/3">
            <div class="flex justify-between items-center">
              <template v-if="editId === data.id">
                <input
                  type="text"
                  :class="`edit-input-${data.id}-em`"
                  v-model="editableUser.email"
                  class="w-4/5"
                  @keydown.enter="handleEnter(data.id, $event)"
                />
                <button @click="updateUserLocal(data.id)" class="ml-2">
                  <img src="/save.png" class="w-4" alt="save" />
                </button>
              </template>
              <template v-else>
                <div @click="editUser(data, 'em')">
                  {{ data.email }}
                </div>
                <button @click="editUser(data, 'em')" class="ml-2">
                  <img src="/edit.png" class="w-4" alt="edit" />
                </button>
              </template>
            </div>
          </td>
          <td class="py-3 px-4 w-1/12">
            <div class="flex justify-between items-center">
              <button @click="deleteUserLocal(data.id)" class="mx-auto">
                <img src="/delete.png" class="w-5" alt="delete" />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import {
  createUser,
  deleteUser,
  getAll,
  updateUser,
} from "../services/vueSpring02ProjectService";
import { User, UserWithId } from "../type";
type errorType = {
  email?: string;
  firstName?: string;
  lastName?: string;
};
const allData = ref<UserWithId[]>([]);
const user = ref<User>({
  firstName: "",
  lastName: "",
  email: "",
});
const errMsgs = ref<errorType>({});

const searchUserInfo = () => {
  getAll()
    .then((res) => {
      allData.value = res.data;
    })
    .catch((e) => {
      console.log(e);
    });
};

// onMountedを使用して初回レンダリング時にsearchUserInfoを実行
onMounted(() => {
  searchUserInfo();
});

const createUserLocal = () => {
  createUser(user.value)
    .then((res) => {
      console.log(res.data);
      user.value.email = "";
      user.value.firstName = "";
      user.value.lastName = "";
    })
    .then(() => {
      getAll().then((resAll) => {
        allData.value = resAll.data;
        errMsgs.value = {
          email: "",
          firstName: "",
          lastName: "",
        };
      });
    })
    .catch((e: any) => {
      console.log(e);
      errMsgs.value = e.response.data;
    });
};

// 編集中のユーザと編集状態を追跡するための追加のステート
const editId = ref<number>(-1);
const editableUser = ref<User>({ firstName: "", lastName: "", email: "" });

// 編集モードに入る関数
const editUser = (user: UserWithId, key: string) => {
  editId.value = user.id;
  editableUser.value = { ...user };

  // DOMの更新後に特定のinput要素にフォーカスを当てる
  nextTick(() => {
    const inputElement = document.querySelector(
      `.edit-input-${user.id}-${key}`
    ) as HTMLElement;
    inputElement?.focus();
  });
};

// enterキーによる保存
const handleEnter = (id: number, event: KeyboardEvent) => {
  if (!event.isComposing) {
    updateUserLocal(id);
  }
};

// 更新処理を行う関数（ここに独自の更新ロジックを追加）
const updateUserLocal = (id: number) => {
  console.log("Updating user:", id, editableUser.value);
  // ここで独自の更新ロジックを実装
  updateUser(editableUser.value, id)
    .then((res) => {
      console.log(res.data);
      console.log(allData.value.find((u) => u.id === id));
      const updatedUser = allData.value.find((u) => u.id === id);
      if (updatedUser) {
        editableUser.value.email = "";
        editableUser.value.firstName = "";
        editableUser.value.lastName = "";
        updatedUser.email = res.data.email;
        updatedUser.firstName = res.data.firstName;
        updatedUser.lastName = res.data.lastName;
      }
    })
    .catch((e: any) => {
      console.log(e);
    });
  editId.value = -1; // 編集モードを終了
};

// 削除処理
const deleteUserLocal = (userId: number) => {
  deleteUser(userId).then(() => {
    getAll().then((resAll) => {
      allData.value = resAll.data;
    });
  });
};
</script>
