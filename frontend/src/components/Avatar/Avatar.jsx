import './Avatar.css'

export default function Avatar({userId, userName}) {
    
    function getRandomColor() {
        const colors = ["rgb(120, 238, 199)", "rgb(232, 238, 120)", "rgb(238, 145, 120)", "rgb(120, 189, 238)", "gb(183, 120, 238)", "rgb(238, 120, 173)"]
        const userIdBase6 = parseInt(userId.substring(10), 16);
        const colorIndex = userIdBase6 % colors.length;
        const color = colors[colorIndex];
        return color
    }

    return (
        <div className="avatar" style={{backgroundColor: getRandomColor()}}>
            <div className="avatar-letter">{userName ? userName[0] : 'G'}</div>
        </div>
    );
}