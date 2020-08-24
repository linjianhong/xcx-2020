
var date = require('./date.js')
var Storage_KEY = "node-list";
var lastID = 1;

function remove(item) {
  var list = load();
  item = list.find(a => a.id == item.id);
  if (!item || !item.id) {
    return false
  } 
  list=list.filter(a=>a!=item)
  try {
    wx.setStorageSync(Storage_KEY, list);
    return item;
  } catch (e) { }
}
function update(item) {
  var t = +new Date();
  var list = load();
  var newItem = list.find(a => a.id == item.id);
  if (!newItem || !item.id) {
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
  } catch (e) { }
}
function load() {
  try {
    var value = wx.getStorageSync(Storage_KEY);
    var list = value;//JSON.parse(value);
    if (Array.isArray(list)) return list;
    return [];
  } catch (e) {
    return [];
  }
}

var Note = {
  date,
  load,
  update,
  remove
}

module.exports = Note