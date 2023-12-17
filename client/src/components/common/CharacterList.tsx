import React from 'react';
import CharacterItem from './CharacterItem';

export default function CharacterList(props: any) {
    interface Character {
        id: string;
        imgSrc: string;
        alt: string;
        val: string;
    }
    const characterArr: Character[] = [
        {
            id: 'character-radio-rabbit',
            // imgSrc: '/asset/images/rab2.svg',
            imgSrc: '/asset/images/emo2.gif',
            alt: 'img1',
            val: 'rabbit',
        },
        {
            id: 'character-radio-dog',
            // imgSrc: '/asset/images/dog2.svg',
            imgSrc: '/asset/images/bea2.png',
            alt: 'img2',
            val: 'dog',
        },
        {
            id: 'character-radio-cat',
            // imgSrc: '/asset/images/cat2.svg',
            imgSrc: '/asset/images/ali2.png',
            alt: 'img3',
            val: 'cat',
        },
        {
            id: 'character-radio-sqr',
            // imgSrc: '/asset/images/sqr2.svg',
            imgSrc: '/asset/images/cat2.gif',
            alt: 'img4',
            val: 'sqr',
        },
    ];

    return (
        <>
            <div className="character-list-div">
                <CharacterItem
                    characterArr={characterArr}
                    selectedCharacter={props.selectedCharacter}
                    setSelectedCharacter={props.setSelectedCharacter}
                    selectCharacter={props.selectCharacter}
                />
            </div>
        </>
    );
}
