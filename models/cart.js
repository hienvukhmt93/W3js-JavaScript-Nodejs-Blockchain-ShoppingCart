module.exports = function Cart(cart) {
    this.items = cart.items || {};
    this.totalItems = cart.totalItems || 0;
    this.totalPrices = cart.totalPrices || 0;
    this.add = function(products) {
        var cartItem = this.items[products.id];
        if (!cartItem) {
            cartItem = this.items[products.id] = {
                id: products._id,
                name: products.name,
                prices: products.prices,
                description: products.description,
                detail: products.detail,
                hashCode: products.hashCode,
                number: products.number,
                address: products.address,
            };
            this.totalItems++;
            this.totalPrices += products.prices;
        }
    };

    this.remove = function(id) {

        if(this.totalItems>0)
        {
            delete this.items[id];
            this.totalItems --;
        }
    };
    
    this.getItems = function() {
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    };
};