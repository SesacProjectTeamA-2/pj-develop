import React from 'react';

export default function GroupFilterTag() {
    const selectedTag = (e: React.MouseEvent<HTMLElement>): void => {
        const selectedBtn: HTMLElement = e.target as HTMLElement;

        if (selectedBtn) {
            selectedBtn.style.background = '#94897c';
            selectedBtn.style.color = '#fff';
            console.log(selectedBtn);
        }
    };
    return (
        <div>
            <div className="interested-div">
                <label
                    htmlFor="tag-radio-all"
                    className="tag-btn"
                    onClick={(e: React.MouseEvent<HTMLElement>) =>
                        selectedTag(e)
                    }
                >
                    <input
                        type="checkbox"
                        name="tag-radio"
                        className="tag-radio"
                        id="tag-radio-all"
                    />
                    전체
                </label>

                <label
                    htmlFor="tag-radio-it"
                    className="tag-btn"
                    onClick={(e: React.MouseEvent<HTMLElement>) =>
                        selectedTag(e)
                    }
                >
                    <input
                        type="checkbox"
                        name="tag-radio"
                        className="tag-radio"
                        id="tag-radio-it"
                    />
                    코딩학당
                </label>
                <label
                    htmlFor="tag-radio-exercise"
                    className="tag-btn"
                    onClick={(e: React.MouseEvent<HTMLElement>) =>
                        selectedTag(e)
                    }
                >
                    <input
                        type="checkbox"
                        name="tag-radio"
                        className="tag-radio"
                        id="tag-radio-exercise"
                    />
                    근손실방지
                </label>
            </div>
        </div>
    );
}
