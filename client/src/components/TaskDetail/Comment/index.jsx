import React, { useState } from "react";
import "./style.scss";
import CommentItem from "./CommentItem";
import { useSelector, useDispatch } from "react-redux";
import { createTaskComment } from "../../../redux/thunk/column";
import Picker from 'emoji-picker-react';

const Comment = () => {
    const { task, project, auth } = useSelector((state) => state);
    const [value, setValue] = useState("");
    const [showPicker, setShowPicker] = useState(false);
    const dispatch = useDispatch();
    const arrComments = [...task.data.comments];

    // HÀM NÀY CHỈ ĐƯỢC GỌI BỞI COMPONENT <Picker />
    const onEmojiClick = (event, emojiObject) => {
        // emojiObject.emoji chứa ký tự emoji, ví dụ: "😊"
        setValue(prevValue => prevValue + emojiObject.emoji);
        setShowPicker(false);
    };

    const handleAttachLink = () => {
        const url = window.prompt("Vui lòng nhập đường dẫn (URL):");
        if (url) {
            setValue(prevValue => `${prevValue} ${url} `);
        }
    };

    function onSubmitComment() {
        if (!value.trim()) return;

        const activityContent = task.data?.title 
            ? `đã bình luận trong thẻ '${task.data.title}'` 
            : "đã gửi một bình luận mới";

        dispatch(
            createTaskComment({
                data: { content: value },
                token: auth.token,
                idProject: project.data._id,
                idTask: task.data._id,
                content: activityContent,
            })
        );
        setValue("");
    }

    return (
        <div className="comment">
            <div className="comment__header">Bình luận</div>
            <div className="comment__input">
                <textarea
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Hãy bình luận về nhiệm vụ này"
                    style={{ resize: "none" }}
                ></textarea>
                <div className="comment__input-btns">
                    <div>
                        {/* DÒNG NÀY CHỈ ĐỂ BẬT/TẮT BẢNG CHỌN, KHÔNG GỌI onEmojiClick */}
                        <i className="bx bx-smile" onClick={() => setShowPicker(val => !val)}></i>
                    </div>
                    <div>
                        <i className="bx bx-link-alt" onClick={handleAttachLink}></i>
                    </div>
                    <button className="btn contain" onClick={onSubmitComment}>
                        Bình luận
                    </button>
                </div>

                {/* COMPONENT PICKER NÀY SẼ GỌI HÀM onEmojiClick KHI BẠN CHỌN 1 EMOJI */}
                {showPicker && (
                    <div style={{ position: 'absolute', bottom: '50px', zIndex: 10 }}>
                        <Picker onEmojiClick={onEmojiClick} />
                    </div>
                )}
                
                <div className="comment__list">
                    {arrComments
                        .sort(
                            (a, b) =>
                                new Date(b.createdAt) - new Date(a.createdAt)
                        )
                        .map((el, i) => (
                            <CommentItem key={i} comment={el} />
                        ))}
                </div>
            </div>
        </div>
    );
};

export default Comment;