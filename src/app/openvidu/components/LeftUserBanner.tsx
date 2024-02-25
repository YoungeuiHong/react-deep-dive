interface Props {
  leftUsers: string[];
}

export default function LeftUserBanner({ leftUsers }: Props) {
  return (
    <>
      {leftUsers.length > 0 && (
        <p className={"bg-gray-200 rounded-lg p-2 mb-4 w-full"}>
          {`${leftUsers.join(", ")}님이 나갔습니다.`}
        </p>
      )}
    </>
  );
}
