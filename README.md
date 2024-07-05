### Preparation

##### Libraries:

[Vite : React](https://vitejs.dev/)
[TailwindCSS](https://tailwindcss.com/)
[ThreeJS](https://threejs.org/)
[React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
[React Three Drei](https://github.com/pmndrs/drei) ( external library for React Three Fiber )
[Valtio](https://valtio.pmnd.rs/docs/introduction/getting-started) (global state management)
[Maath](https://github.com/pmndrs/maath) ( colour transition )

<!-- [GSAP](https://gsap.com/) ( creating elegant camera movement) -->
<!-- [React Route Dom](https://reactrouter.com/en/main) ( for page navigation) -->

### Project Setup

##### Install Yarn

If you don't have yarn please follow this [link](https://yarnpkg.com/features/caching) to learn more or
or install it directly with npm:

```bash
npm install --global yarn
```

##### Initiating a new project

Navigate to your project folder then write:

```bash
yarn create vite YourProjectName
```

Before the installation start, the system will prompt what framework you would like to use. Select **react**. For the language, choose the language that fits your liking.

Once the installation completed

```bash
cd YourProjectName
```

Then

```bash
yarn add three sass tailwindcss postcss autoprefixer gsap valtio three postprocessing @react-three/fiber @react-three/drei

```

This command is included the installation of TailwinCSS to your project.

If you are using Typescript for your development:

```bash
yarn add @types/three
```

After this:

```bash
npx tailwindcss init -p
```

Once it is done, find edit `tailwind.config.js` in the root of your project.

Select all and replace with the following code:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
	theme: {
		extend: {},
	},
	plugins: [],
};
```

Then put these at the top of your CSS file:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

##### Step 1: Canvas component

[Getting started of @react-three/fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)

Set up a `<Canvas/>` from the example above in your `App.jsx`

```jsx
import { createRoot } from "react-dom/client";
import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

function Box(props) {
	// This reference will give us direct access to the mesh
	const meshRef = useRef();
	// Set up state for the hovered and active state
	const [hovered, setHover] = useState(false);
	const [active, setActive] = useState(false);
	// Subscribe this component to the render-loop, rotate the mesh every frame
	useFrame((state, delta) => (meshRef.current.rotation.x += delta));
	// Return view, these are regular three.js elements expressed in JSX
	return (
		<mesh {...props} ref={meshRef} scale={active ? 1.5 : 1} onClick={(event) => setActive(!active)} onPointerOver={(event) => setHover(true)} onPointerOut={(event) => setHover(false)}>
			<boxGeometry args={[1, 1, 1]} />
			<meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
		</mesh>
	);
}

createRoot(document.getElementById("root")).render(
	<Canvas>
		<ambientLight intensity={Math.PI / 2} />
		<spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
		<pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
		<Box position={[-1.2, 0, 0]} />
		<Box position={[1.2, 0, 0]} />
	</Canvas>
);
```

Before we able to make the objects able to change colour gradually, we need `'maath'` and `'valtio'` to do the magic for us. So lets head to `src` folder and create a file called `store.js` ( next to main.jxs) to create our global state for us to mutate it later on.

##### Step 2: Store.js

[Introduction and examples of Valtio](https://github.com/pmndrs/valtio)

```js
import { proxy } from "valtio";

export const store = proxy({
	colour: "#FF69B4", // let's set the default colour as hotpink
});
```

Simple and easy, how about mutating the state?

Head back to `main.js`, create a new component called `BottomUI`, add a `<Html/>` component from `'@react-three/drei'` inside the `<Canvas/>` element, and make 3 buttons wrapped inside a div, put them under `<Html/>` as a child.

And also add

```js
const snap = useSnapshot(store);
```

right before the `return` in `BottomUI` component,

and `Box` component, before `useFrame`

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

function Box(props) {
	// This reference will give us direct access to the mesh
	const meshRef = useRef();
	// Set up state for the hovered and active state
	const [hovered, setHover] = useState(false);
	const [active, setActive] = useState(false);
	const snap = useSnapshot(store);
	// Subscribe this component to the render-loop, rotate the mesh every frame
	useFrame((state, delta) => (meshRef.current.rotation.x += delta));
	// Return view, these are regular three.js elements expressed in JSX
	return (
		<mesh {...props} ref={meshRef} scale={active ? 1.5 : 1} onClick={(event) => setActive(!active)} onPointerOver={(event) => setHover(true)} onPointerOut={(event) => setHover(false)}>
			<boxGeometry args={[1, 1, 1]} />
			<meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
		</mesh>
	);
}

function BottomUI() {
	const snap = useSnapshot(store);

	return (
		<Html fullscreen>
			<div className={"h-24 w-full absolute bottom-0 left-0 flex justify-center items-center gap-x-12 border border-black"}>
				<button id="hotpink" className="size-12 bg-[#FF69B4] rounded-full" style={{ scale: snap.colour === "#FF69B4" ? "1.2" : "1.0" }}></button>
				<button id="flamered" className="size-12 bg-[#AF2B1E] rounded-full" style={{ scale: snap.colour === "#AF2B1E" ? "1.2" : "1.0" }}></button>
				<button id="blackbrown" className="size-12 bg-[#212121] rounded-full" style={{ scale: snap.colour === "#212121" ? "1.2" : "1.0" }}></button>
			</div>
		</Html>
	);
}

createRoot(document.getElementById("root")).render(
	<Canvas>
		<ambientLight intensity={Math.PI / 2} />
		<spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
		<pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
		<Box position={[0, 0, 0]} />
		<BottomUI />
	</Canvas>
);
```

#### Change colour with `maath`
To make the colour change smoothly we need to use ```maath``` to perform the magic.

Firstly let's import `easing` from `maath`

```jsx
import {easing} from 'maath';
```

In the `Box` component, we need to make some changes to useFrame to 

```jsx
    useFrame((state, delta) => {
        meshRef.current.rotation.x += delta;
        easing.dampC(meshRef.current.material.color, snap.colour, 0.05, delta);
    })
```

Then, in the `return` we need to remove the `colour` in side the `<meshStandardMaterial/>`

```jsx
    return (
        <mesh
            {...props}
            ref={meshRef}
            scale={active ? 1.5 : 1}
            onClick={(event) => setActive(!active)}
            onPointerOver={(event) => setHover(true)}
            onPointerOut={(event) => setHover(false)}>
            <boxGeometry args={[1, 1, 1]}/>
            <meshStandardMaterial/>
        </mesh>
    )
```

After that your `Box` component would look like this 

```jsx
function Box(props) {
    // This reference will give us direct access to the mesh
    const meshRef = useRef()
    // Set up state for the hovered and active state
    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false)
    const snap = useSnapshot(store)

    // Subscribe this component to the render-loop, rotate the mesh every frame
    useFrame((state, delta) => {
        meshRef.current.rotation.x += delta;
        easing.dampC(meshRef.current.material.color, snap.colour, 0.05, delta);
    })
    // Return view, these are regular three.js elements expressed in JSX
    return (
        <mesh
            {...props}
            ref={meshRef}
            scale={active ? 1.5 : 1}
            onClick={(event) => setActive(!active)}
            onPointerOver={(event) => setHover(true)}
            onPointerOut={(event) => setHover(false)}>
            <boxGeometry args={[1, 1, 1]}/>
            <meshStandardMaterial/>
        </mesh>
    )
}
```

To make it work, now head back to `BottomUI` component to add a `handleColourChange` function to listen to button clicking event. 

add 

```jsx
    const handleColourChange = (e) => {
        switch (e.target.id) {
            case "hotpink":
                store.colour = "#FF69B4"
                break;
            case "flamered":
                store.colour = "#AF2B1E"
                break;
            case "blackbrown":
                store.colour = "#212121"
                break;
            default:
                store.colour = "#FF69B4"
        }
    }
```

right before the `return`

and add a `onClick` to every button to listen the click event

```jsx
  <button id="hotpink" onClick={handleColourChange} ...
```

Now your `BottomUI` would looked like this:

```jsx
function BottomUI() {
    const snap = useSnapshot(store)
    const handleColourChange = (e) => {
        switch (e.target.id) {
            case "hotpink":
                store.colour = "#FF69B4"
                break;
            case "flamered":
                store.colour = "#AF2B1E"
                break;
            case "blackbrown":
                store.colour = "#212121"
                break;
            default:
                store.colour = "#FF69B4"
        }
    }

    return (<Html fullscreen>
        <div
            className={"h-24 w-full absolute bottom-0 left-0 flex justify-center items-center gap-x-12 border border-black"}>
            <button id="hotpink" onClick={handleColourChange} className="size-12 bg-[#FF69B4] rounded-full"
                    style={{scale: snap.colour === "#FF69B4" ? "1.2" : "1.0"}}></button>
            <button id="flamered" onClick={handleColourChange} className="size-12 bg-[#AF2B1E] rounded-full"
                    style={{scale: snap.colour === "#AF2B1E" ? "1.2" : "1.0"}}></button>
            <button id="blackbrown" onClick={handleColourChange} className="size-12 bg-[#212121] rounded-full"
                    style={{scale: snap.colour === "#212121" ? "1.2" : "1.0"}}></button>
        </div>
    </Html>)
}
```

There you have it! Feel free to change the value of `easing.dampC` in 3rd argument inside `Box` component to change the transition speed.




Hope you enjoy my smooth demonstration! 