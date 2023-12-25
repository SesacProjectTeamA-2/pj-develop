import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function InterestedItem({
    interestedArr,
    selectedArr,
    setSelectedArr,
    num,
    updateCategoryQuery,
}: any) {
    // 체크박스 상태 관리
    const [selected, setSelected] = useState<boolean>(false);

    // 체크박스 개수 제한
    // const [selectedArr, setSelectedArr] = useState<Set<string>>(
    //     new Set<string>()
    // );

    // 체크박스 체크 여부 변경 이벤트
    function SelectedTag(e: React.ChangeEvent<HTMLElement>): void {
        const selectedBtn: HTMLElement = e.target as HTMLElement; //선택된 버튼(label)
        setSelected((prevSelected) => !prevSelected); //선택 여부 관리 (직전 상태 기반)

        // 토글 기능
        if (selectedArr.includes(selectedBtn.id)) {
            // (1) 배열에 있으면 : 배열에서 제거
            const nextSelectedArr: Array<string> = selectedArr.filter(
                (ele: string) => ele !== selectedBtn.id //마지막으로 선택된 버튼 id 제거
            );
            setSelectedArr(nextSelectedArr);
        } else if (
            // (2) 배열에 없음 + 동적 제한 수 미만 : 배열에 추가
            !selectedArr.includes(selectedBtn.id)
        ) {
            if (selectedArr.length > num - 1) {
                // console.log(selectedArr.length, 'selectedArr.length');
                toast.error(`최대 ${num}개까지만 선택해주세요!`);
                return;
            }

            setSelectedArr((prevSelectedArr: any) => {
                const newSelectedArr = [...prevSelectedArr, selectedBtn.id];
                return newSelectedArr;
            });
        }
    }
    return (
        <div>
            <div className="interested-div">
                {interestedArr.map((interestedArr: any) => {
                    const iId: string = interestedArr.id;
                    const isSelected: boolean = selectedArr.includes(iId);

                    return (
                        <div key={iId}>
                            <label
                                className="tag-btn"
                                style={{
                                    background: isSelected
                                        ? '#94897c'
                                        : 'white',
                                    color: isSelected ? 'white' : 'gray',
                                    border: isSelected
                                        ? '1px solid #94897c'
                                        : ' #acacac',
                                }}
                            >
                                <input
                                    type="checkbox"
                                    name="tag-radio"
                                    className="tag-radio"
                                    id={iId}
                                    value={interestedArr.val}
                                    checked={isSelected}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLElement>
                                    ) => SelectedTag(e)}
                                />
                                {interestedArr.category}
                            </label>
                            <Toaster />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
