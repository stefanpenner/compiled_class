function Controller(options) {
  this.firstName = 'stefan';
  this.lastName = 'penner';

  Foo.call(this, options); // could in theory inline this...
}

Controller.prototype = Object.create(Foo);

Controller.prototype.constructor = Controller;

Controller.prototype._super$orange = Foo.prototype.orange;

Controller.prototype._super$update = Foo.prototype.update;

Controller.prototype._super$apple  = Foo.prototype.apple;

Controller.prototype.update = function(camera) {
  this._super$orange(camera, foo);
  this._super$update(camera, foo);
};

Controller.prototype.apple = function(camera) {
  this._super$apple(camera, foo);
};

Controller.prototype.orange = function() {
  this._super$orange.apply(this, arguments);
};

Controller.prototype.foo = function() {
  this._super$orange.bar(arguments);
};

Controller.prototype.fullName = function() {
  return [
    this.fullName,
    this.lastName
  ].compact().join(' ');
};
