import React, { useState, useEffect } from 'react';

export default function CharacterItem(props: any) {
    useEffect(() => {
        console.log('Selected Character:::::', props.selectedCharacter);
    }, [props.selectedCharacter]);

    return (
        <div className="character-item-div">
            {props.characterArr.map((character: any) => {
                return (
                    <label
                        key={character.id}
                        onClick={() => props.selectCharacter(character.imgSrc)}
                        className="character-label"
                        style={{
                            // border:
                            //     props.selectedCharacter === character.imgSrc
                            //         ? '5px solid #ed8d8d'
                            //         : 'none',

                            borderRadius: '25px',
                            transition: 'all 0.2s',
                        }}
                    >
                        <input
                            type="radio"
                            name="character-radio"
                            className="character-radio"
                            id={character.id}
                            value={character.val}
                            readOnly
                            required
                        />
                        <img
                            src={character.imgSrc}
                            alt={character.alt}
                            className="character-img"
                        />
                        <svg
                            fill="#21b30c"
                            viewBox="0 0 16 16"
                            height="2em"
                            width="2em"
                            className="char-check-icon"
                            style={{
                                display:
                                    props.selectedCharacter === character.imgSrc
                                        ? 'block'
                                        : 'none',
                            }}
                        >
                            <path d="M16 8A8 8 0 110 8a8 8 0 0116 0zm-3.97-3.03a.75.75 0 00-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 00-1.06 1.06L6.97 11.03a.75.75 0 001.079-.02l3.992-4.99a.75.75 0 00-.01-1.05z" />
                        </svg>
                    </label>
                );
            })}
        </div>
    );
}
