export default function ConfirmDialog({ message, onYes, onNo, busy }) {
    return (
        <div className="overlay">
            <div className="dialog" data-testid="confirm-dialog" role="dialog">
                <p>{message}</p>
                <button type="button" data-testid="confirm-no" onClick={onNo} disabled={busy}>Huỷ</button>
                <button type="button" data-testid="confirm-yes" onClick={onYes} disabled={busy}>Đồng ý</button>
            </div>
        </div>
    );
}