const cloud = require('wx-server-sdk')
cloud.init({
  env: "dev-90note"
})
const myDB = cloud.database(); //{ env: 'dev-90note' }

var Note = {

  unionid: "",

  remove: async function (item) {
    var list = await Note.load();
    item = list.find(a => a.id == item.id);
    if (!item || !item.id) {
      return false
    }
    var t = +new Date();
    item.t2 = t;
    // list=list.filter(a=>a!=item)
    await Note.save(list);
    return item;
  },

  update: async function (item) {
    if (Array.isArray(item)) {
      for (var i in item) {
        await Note.update(item[i]);
      }
      return;
    }
    var t = +new Date();
    var list = await Note.load() || [];
    var newItem = list.find(a => a.id == item.id);
    if (!newItem && item.id) {
      list.push(item);
    } else if (!newItem ) {
      var id = list.map(a => a.id).sort((a, b) => b - a)[0];
      if (!id) id = 1; else id++;
      newItem = {
        id,
        t,
        text: item.text
      };
      list.push(newItem);
    } else {
      newItem.t = t;
      newItem.text = item.text;
    }
    await Note.save(list);
    return newItem;
  },

  load: function () {
    console.log("load, unionid=", Note.unionid)
    // return Note.unionid
    return myDB.collection('note90').where({
      unionid: Note.unionid
    }).get().then(res => {
      console.log("get then: res=", res)
      // return res && res.data && res.data[0] || [];
      var row = res && res.data && res.data[0] || {};
      if (!row || !row.unionid) {
        myDB.collection('note90').add({
          data: {
            unionid: Note.unionid,
            list: []
          }
        });
      }
      return row.list || [];
    }).catch(e => []);
  },

  save: function (list) {
    return myDB.collection('note90').where({
      unionid: Note.unionid
    }).update({
      data: {
        list
      }
    })
  }

}
exports.main = async (event, context) => {
  let { path, data } = event
  let { OPENID, UNIONID } = cloud.getWXContext() // 这里获取到的 openId 和 appId 是可信的

  console.log("unionid", OPENID)
  Note.unionid = OPENID;

  // return { OPENID, UNIONID, path, data };

  if (!Note[path]) return {
    errcode: 1,
    errmsg: "不存在指定调用" + path,
  }
  let datas = await Note[path](data);
  return {
    errcode: 0,
    path,
    data,
    datas
  }

}
