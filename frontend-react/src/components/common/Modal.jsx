export default function Modal({ show, icon, iconBg, iconColor, title, desc, onClose }) {
    if (!show) return null;
    return (
        <div className={`modal-overlay ${show ? 'active' : ''}`} onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal__icon" style={{ background: iconBg, color: iconColor }}>
                    <i className={`fas ${icon}`}></i>
                </div>
                <h3 className="modal__title">{title}</h3>
                <p className="modal__desc">{desc}</p>
                <button className="btn btn--primary" onClick={onClose}>Got it</button>
            </div>
        </div>
    );
}
