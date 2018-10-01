module.exports = function Cart(oldCart) {
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;

    this.add = function (item, id, quantity) {
        var storedItem = this.items[id];
        if (!storedItem) {
            storedItem = this.items[id] = { item: item, qty: 0, price: 0 };
        }
        storedItem.qty = parseInt(storedItem.qty, 10) + quantity;

        storedItem.price = storedItem.item.price * storedItem.qty;
        this.totalQty += quantity;
        this.totalPrice = this.totalPrice + (storedItem.item.price * quantity);

    };

    this.reduce = function (item, id) {
        var storedItem = this.items[id];
        if (!storedItem) {
            storedItem = this.items[id] = { item: item, qty: 0, price: 0 };
        }
        storedItem.qty--;
        storedItem.price = storedItem.item.price * storedItem.qty;
        this.totalQty--;

        if (this.totalPrice > storedItem.item.price) {
            this.totalPrice = this.totalPrice - storedItem.item.price;
        }

    };
    this.increase = function (item, id) {
        console.log("i am in");
        var storedItem = this.items[id];
        if (!storedItem) {
            storedItem = this.items[id] = { item: item, qty: 0, price: 0 };
        }
        storedItem.qty++;
        storedItem.price = storedItem.item.price * storedItem.qty;
        this.totalQty++;


        this.totalPrice = this.totalPrice + storedItem.item.price;
    };
    this.removeAll = function (item, id) {
        var storedItem = this.items[id];
        if (!storedItem) {
            storedItem = this.items[id] = { item: item, qty: 0, price: 0 };
        }
        this.totalQty -= storedItem.qty;
        storedItem.qty = 0;
        this.totalPrice = this.totalPrice - storedItem.price;
    };
    this.generateArray = function () {
        var arr = [];
        for (var id in this.items) {
            if (this.items[id].qty > 0) {
                arr.push(this.items[id]);
            }
        }
        return arr;
    };

};

