"use client"
import {memo, useEffect, useState} from "react";

/**
 * 모던 리액트 Deep Dive 33p
 * React.memo의 깊은 비교 문제 예
 *
 * memo lets you skip re-rendering a component when its props are unchanged.
 * 일반적으로 부모 컴포넌트가 리렌더링되면 자식 컴포넌트도 리렌더링되지만 memo로 감싸면 props가 변경됐을 때에만 리렌더링되게 할 수 있다.
 * 메모이제이션된 컴포넌트는 props가 변경되었거나, 내부의 state가 변경되었을 때 리렌더링된다.
 *
 * 리액트에서 값을 비교할 때에는 Object.is로 먼저 비교를 수행한 다음에, Object.is에서 수행하지 못하는 비교에 대해 객체 간 얕은 비교를 한 번 더 수행한다.
 * 객체 간 얕은 비교란 객체의 첫 번째 깊이에 존자하는 값만을 비교하는 것이다.
 *
 * 아래 코드를 보면 메모이제이션된 컴포넌트의 Props를 비교할 때
 * Object.is는 참조가 다른 객체에 대해 비교가 불가능하므로 false를 반환하고, 그러면 객체 간 얕은 비교가 수행된다.
 * Component는 얕은 비교가 가능해서, 버튼을 눌러도 counter 값이 바뀌지 않으므로 다시 렌더링되지 않는데,
 * DeeperComponent의 경우 2-depth 부터는 비교가 불가능하므로 false를 반환하고, 그래서 버튼을 눌렀을 때  counter 값이 바뀌지 않았음에도 계속 렌더링된다.
 */

type Props = {
    counter: number;
}

const Component = memo(function Component(props: Props) {
    useEffect(() => {
        console.log('Component has been rendered!');
    });

    return <h1>{props.counter}</h1>
})

type DeeperProps = {
    counter: {
        counter: number;
    }
}

const DeeperComponent = memo(function DeeperComponent(props: DeeperProps) {
    useEffect(() => {
        console.log('DeeperComponent has been rendered!');
    });

    return <h1>{props.counter.counter}</h1>
})

export default function ShallowEqualUseMemo() {
    const [, setCounter] = useState(0);

    const handleClick = () => {
        setCounter((prev) => prev + 1);
    }

    return (
        <>
            <Component counter={100}/>
            <DeeperComponent counter={{counter: 100}}/>
            <button onClick={handleClick}>+</button>
        </>
    )
}

