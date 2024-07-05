import React, {useRef, useState} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {Canvas, useFrame} from '@react-three/fiber'
import {Html} from "@react-three/drei";
import {useSnapshot} from "valtio";
import {store} from "./store.js";
import {easing} from "maath"

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

createRoot(document.getElementById('root')).render(
    <Canvas>
        <ambientLight intensity={Math.PI / 2}/>
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI}/>
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI}/>
        <Box position={[0, 0, 0]}/>
        <BottomUI/>
    </Canvas>
)
