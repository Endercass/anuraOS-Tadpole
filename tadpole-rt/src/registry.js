class ComponentRegistry {
  constructor() {
    this.components = {};
    this.handlers = {};
  }

  subscribe(name, handler) {
    this.handlers[name] = [...(this.handlers[name] || []), handler];
  }

  register(name, component) {
    if (this.components[name]) {
      throw new Error(`Component ${name} is already registered.`);
    }
    this.components[name] = component;
    if (this.handlers[name]) {
      this.handlers[name].forEach((handler) => handler(component));
      delete this.handlers[name];
    }
  }

  get(name) {
    return this.components[name];
  }

  waitAndGet(name) {
    return new Promise((resolve) => {
      if (this.components[name]) {
        resolve(this.components[name]);
      } else {
        this.subscribe(name, resolve);
      }
    });
  }
}

export const componentRegistry = new ComponentRegistry();

export const registerComponent =
  componentRegistry.register.bind(componentRegistry);

export const getComponent =
  componentRegistry.waitAndGet.bind(componentRegistry);

window.registerComponent = registerComponent;
window.getComponent = getComponent;
