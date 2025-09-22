// src/pages/Home.tsx
import React from "react";
import MuseumScene from "../3d/MuseumScene";

const Home: React.FC = () => {
  return (
    <main style={{ padding: "24px" }}>
      <h1>Welcome to the Telugu Virtual Museum</h1>
      <p>Explore Telugu heritage, festivals, art, and culture in an immersive 3D experience.</p>

      {/* 3D Museum Canvas */}
      <div style={{ width: "100%", height: "600px", marginTop: "24px" }}>
        <MuseumScene />
      </div>
    </main>
  );
};

export default Home;
