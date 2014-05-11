compiled_class
==============

still a spike, still WIP, don't use this or expect it to work

input:
------

```js
class Controller extends Foo {
  constructor(options) {

    this.fullName = 'stefan';
    this.lastName = 'penner';

    super(options);
  }

  update(camera) {
    super.update(camera, foo);
    super.orange(camera, foo);
  }

  apple(camera) {
    super.apple.apply(this, [camera, foo]);
  }

  orange () {
    super.orange.apply(this, arguments);
  }

  foo () {
    super.orange.bar(arguments);
  }


  //+property('fullName', 'lastName');
  fullName() {
    return [
      this.fullName,
      this.lastName
    ].compact().join(' ');
  }
};

```

output:
-------

```js
function Controller(options) {
    this.fullName = 'stefan';
    this.lastName = 'penner';
    super(options); // wrong still, should be Foo.call(this, options);
    super.apply(this, arguments); // wrong still, should be Foo.apply(this, arguments);
} 

Controller.prototype = Object.create(Foo);

Controller.prototype.constructor = Controller;

Controller.prototype.update = function (camera) {
    this.constructor.prototype.update.call(this, camera, foo);
    this.constructor.prototype.orange.call(this, camera, foo);
};
Controller.prototype.apple = function (camera) {
    this.constructor.prototype.apple.apply(this, [
        camera,
        foo
    ]);
};
Controller.prototype.orange = function () {
    this.constructor.prototype.orange.apply(this, arguments);
};
Controller.prototype.foo = function () {
    this.constructor.prototype.orange.bar(arguments);
};
Controller.prototype.fullName = function () {
    return [
        this.fullName,
        this.lastName
    ].compact().join(' ');
};
```
