
var date = require('./date.js')
var Storage_KEY = "node-list";
var lastID = 1;

async function remove(item) {
  var list = await load();
  item = list.find(a => a.id == item.id);
  if (!item || !item.id) {
    throw "item not exist"
  }

  var t = +new Date();
  item.t2 = t;
  // list=list.filter(a=>a!=item)
  try {
    wx.setStorageSync(Storage_KEY, list);
    return item;
  } catch (e) { }
}
async function update(item) {
  var t = +new Date();
  var list = await load();
  var newItem = list.find(a => a.id == item.id);
  if (!newItem && item.id) {
    list.push(item);
  } else if (!newItem || !item.id) {
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
  try {
    wx.setStorageSync(Storage_KEY, list);
    return newItem;
  } catch (e) {
    console.error(e)
    return e
  }
}
async function load() {
  console.log("前端 load")
  try {
    var value = wx.getStorageSync(Storage_KEY);
    var list = value;//JSON.parse(value);
    if (Array.isArray(list)) return list
    return []
  } catch (e) {
    return []
  }
}

var Note_base = {
  date,
  load,
  update,
  remove
}
var CloundData = {};
["load", "update", "remove"].map(async function (path) {
  CloundData[path] = async function (data) {
    let postData = { path, data }
    return wx.cloud.callFunction({
      name: 'datas',
      data: postData
    });
  }
});

var Note = {
  date,
  load,
  update,
  remove
};
["load", "update", "remove"].map(async function (path) {
  Note[path] = async function (data) {
    let postData = { path, data }
    let res = await Note_base[path](data)
    let res_cloud = await CloundData[path](data)
    console.log("本地返回:", res, "云函数返回:", res_cloud)
    if (path == "load") {
      res_cloud = res_cloud.result.datas;
      let only_local = res.filter(item => !res_cloud.find(a => a.id == item.id));
      if (only_local.length > 0) CloundData.update(only_local).then(r => {
        console.log("批量上传:", r)
      });

      let only_cloud = res_cloud.filter(item => !res.find(a => a.id == item.id));
      if (only_cloud.length > 0)for(var i in only_cloud) {
        console.log("本地添加:", only_cloud[i])
        res.push(only_cloud[i]);
        await Note_base.update(only_cloud[i])
      }
    }
    return res
  }
})

module.exports = Note