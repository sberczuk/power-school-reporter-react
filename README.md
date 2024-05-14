


# Power School Report Card Tool

When our school system switched from paper report card to using the power school portal, 
we lost the ability to view a concise summary of a school year's activities 
including grades and comments.

Since Power School has a data export function, I wrote a tool that lets you generate year by year "report cards"
that you save in PDF form (or print even) usng your browser's print function.

The app is currently deployed on  [Github pages](https://sberczuk.github.io/power-school-reporter-react/)

The data is processed _entirely in the browser_ on your device.

Some caveats:

- The layout assumes that the marking periods are labeled as 'Terms' (T1, T2, T3, Y1) or 'Quarters' (Q1, Q2, Q3, Q4, Y1)
- The layout is pretty basic. I welcome suggestions, or even [code contributions](https://github.com/sberczuk/power-school-reporter-react), though I may not get to everything promptly.

If you want to  contribute a change submit a  pull reqest or fork the project

## Using the App

If you just want to try the app it is [deployed on Github Pages](https://sberczuk.github.io/power-school-reporter-react/).
I built this for my school district, and I'm not entirely sure what elemens of the XML export are custom
per district, so it may not work as expected.



## App Template info

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
