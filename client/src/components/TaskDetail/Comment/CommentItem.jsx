import React from "react";
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const CommentItem = ({ comment }) => {
    // Tính toán thời gian đã trôi qua từ comment.createdAt
    const timeAgo = formatDistanceToNow(new Date(comment.createdAt), {
        addSuffix: true, // Thêm chữ "trước"
        locale: vi,      // Dịch sang Tiếng Việt
    });

    return (
        <div className="comment__item">
            <div className="comment__item-header">
                <div className="comment__item-header__avatar">
                    <img src={comment.user.avatar} alt="" />
                    <div className="comment__item-header__avatar-active"></div>
                </div>
                <h3 className="comment__item-header__name">
                    {comment.user.username}
                </h3>
                <div className="comment__item-header__icon">
                    <i className="bx bx-dots-horizontal-rounded"></i>
                </div>
            </div>
            <div className="comment__item-content">{comment.content}</div>
            <div className="comment__item-footer">
                <div className="comment__item-footer__icon">
                    <i className="bx bx-smile"></i>
                </div>
                <div className="comment__item-footer__reply">Phản hồi</div>

                {/* THAY THẾ DÒNG CODE CŨ BẰNG DÒNG NÀY */}
                <div className="comment__item-footer__time">{timeAgo}</div>
                
            </div>
        </div>
    );
};

export default CommentItem;