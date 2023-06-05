import { useState, useEffect } from "react";
import candle from "../assets/candle.png";
import frog from "../assets/frog.png";
import pot from "../assets/pot.png";
import potionblue from "../assets/potionblue.png";
// import potion from "../assets/potion.png";
import hat from "../assets/hat.png";
import crystals from "../assets/crystals.png";
import crystalball from "../assets/crystalball.png";
import crow from "../assets/crow.png";
import book from "../assets/book.png";

type Props = {
    level: number;
};

export const Gallery = ({ level }: Props) => {
    const [gallery, setGallery] = useState<number>(0);

    const fullGallery: Array<string> = [candle, book, frog, pot, crow, crystalball, crystals, potionblue, hat];
    const achievedGallery: Array<string> = fullGallery.slice(0, level);

    const GalleryItems = () => {
        const listItem = achievedGallery.map((item) => <div className="w-1/3" key={item}><img src={item} alt="achievement"></img></div>);
        return <>{listItem}</>;
    };

    useEffect(() => {
        setGallery(level);
    }, [level]);

    return (
        <div>
            <br/>
            <hr/>
            {gallery == 9 ? <h3 className="animate-pulse text-xs text-right mb-2 text-violet-500">Congratulations! You have completed the Swanky Magink! School</h3>
            : <p className="text-xs text-right mb-2 text-violet-500">You earned {gallery} badges</p>}
            <div className="flex flex-wrap">
                <GalleryItems />
            </div>
        </div>
    )
}