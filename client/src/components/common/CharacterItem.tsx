import React, { useState, useEffect } from 'react';

export default function CharacterItem(props: any) {
    useEffect(() => {
        // console.log('Selected Character:', props.selectedCharacter);
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
                            border:
                                props.selectedCharacter === character.imgSrc
                                    ? '5px solid #ed8d8d'
                                    : 'none',
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
                    </label>
                );
            })}
        </div>
    );
}
