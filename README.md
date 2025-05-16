# anuraOS Tadpole

anuraOS Tadpole is an integrated development and learning environment for making [anuraOS](https://anura.pro) applications using the [dreamland](https://dreamland.js.org) framework. It is aimed at those in K-12 education who are interested in learning programming and app development. Learners can design web components using both code-based and visual programming methods powered by [Blockly](https://developers.google.com/blockly). The goal is to provide a fun and engaging way to learn programming concepts while creating real applications that can be deployed on anuraOS.

## Goals (in order of priority)

1. **Bootstrapped environment with code components**: The code-based components should be priority #1, with the visual programming components being a later focus. There should be helper wrapper methods globally available and an enforced 1:1 component-to-file mapping. Component files should not be imported directly, but instead through a registry system that is mostly hidden from the end developer, allowing for seamless integration of code and visual programming components later on.
2. **JSX Compilation**: Use some sort of transpiler compiled to wasm to compile JSX modules as well as the html tag string components.
3. **Code Editor**: We will use vscode for the editor, as it is a widely used and powerful editor and has existing support for anuraOS.
4. **Visual programming**: The visual programming components should be step 2, as they will definitely be more difficult to implement. We will need to create a custom Blockly extension that allows for the creation of dreamland components. This will require a lot of work, but it is a necessary step to make the visual programming experience seamless and easy to use.
5. **Visual Editor**: The visual editor should be a drag-and-drop interface that allows users to create and edit components visually. This will include a preview frame for the app's components and the actual blockly editor.
