import './Avatar.css'

export default function Avatar({userId, userName}) {
    
    function getRandomColor() {
        const color = ["rgb(120, 238, 199)", "rgb(232, 238, 120)", "rgb(238, 145, 120)", "rgb(120, 189, 238)", "gb(183, 120, 238)", "rgb(238, 120, 173)"]
        const index = Math.floor(Math.random() * color.length);
        return color[index];
    }

    return (
        <div className="avatar" style={{backgroundColor: getRandomColor()}}>
            <div className="avatar-letter">{userName ? userName[0] : 'G'}</div>
        </div>
    );
}