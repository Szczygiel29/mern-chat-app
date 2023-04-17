import './Avatar.css'

export default function Avatar({ userId, userName, online}) {

    function getRandomColor() {
        const colors = [
            "rgb(120, 238, 199)",
            "rgb(232, 238, 120)",
            "rgb(238, 145, 120)",
            "rgb(120, 189, 238)",
            "rgb(183, 120, 238)",
            "rgb(238, 120, 173)",
            "rgb(255, 102, 102)",
            "rgb(102, 178, 255)",
            "rgb(255, 178, 102)",
            "rgb(102, 255, 178)"
        ];
        const userIdBase6 = parseInt(userId.substring(10), 16);
        const colorIndex = userIdBase6 % colors.length;
        const color = colors[colorIndex];
        return color
    }

    return (
        <div className="avatar" style={{ backgroundColor: getRandomColor() }}>
            <div className="avatar-letter">{userName ? userName[0] : 'G'}</div>
            {online && (
                <div className='show-online'></div>
            )}
            {!online && (
                <div className='show-offline'></div>
            )}
        </div>
    );
}