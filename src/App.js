import { Console, Random } from '@woowacourse/mission-utils';

class App {
  async play() {
    Console.print('숫자 야구 게임을 시작합니다.');

    let restart = true;

    while (restart) {
      const answer = this.generateRandomNumbers();
      let correct = false; // 처음은 당연히 못 맞췄으니까 false

      while (!correct) { // correct는 사용자의 응답이 정답인지 오답인지 판단하는 변수
        const input = await Console.readLineAsync('숫자를 입력해주세요 : '); // 비동기 방식(사용자의 입력을 기다리는)이라 await 필요

        try {
          this.validate(input); // 입력이 유효한지 검사
        } catch (error) { // validate의 에러 검사
          Console.print(error.message);
          throw error; // 콘솔 및 실제 프로그램(테스트 출력창)에도 던지기 위함
        }

        const guess = input.split('').map(Number); // map(Number)은 사용자의 입력(guess)을 배열로 반환
        const result = this.judge(guess, answer); // guess : 사용자의 입력, answer : 컴퓨터가 뽑은 숫자

        Console.print(result.message);

        if (result.strike === 3) { // 3개의 숫자를 모두 맞췄을 때
          Console.print('3개의 숫자를 모두 맞히셨습니다! 게임 종료');
          const choice = await Console.readLineAsync( // 유저에게 질문 : 비동기 방식 => await
              '게임을 새로 시작하려면 1, 종료하려면 2를 입력하세요.\n'
          );

          if (choice === '1') {
            restart = true; // 게임 다시 시작
            correct = true; // 현재 게임은 종료
          } else if (choice === '2') {
            restart = false; // 전체 게임 종료
            correct = true; // 현재 게임은 종료
          } else {
            throw new Error('[ERROR] 잘못된 입력입니다.');
          }
        }
      }
    }
  }

  generateRandomNumbers() {
    const numbers = []; // 컴퓨터가 고르는 숫자 넣는 배열

    while (numbers.length < 3) { // numbers 배열에 숫자 3개가 들어올 때까지
      const num = Random.pickNumberInRange(1, 9); // 라이브러리 제공 함수
      if (!numbers.includes(num)) { // num이 numbers 배열에 포함되는지 확인
        numbers.push(num); // 포함 안되어있으면 push(추가)
      }
    }

    return numbers;
  }

  validate(input) {
    if (!/^[1-9]{3}$/.test(input)) { // 숫자 3자리, 1~9자리만 사용
      throw new Error('[ERROR] 입력은 1~9 사이의 서로 다른 숫자 3자리여야 합니다.');
    }

    const digits = input.split('');
    if (new Set(digits).size !== 3) { // 숫자가 3개인데 set의 크기가 3개가 아니면 중복 O
      throw new Error('[ERROR] 숫자는 중복되면 안 됩니다.');
    }
  }

  judge(guess, answer) { // 사용자의 입력(guess)과 컴퓨터의 정답(answer)을 비교
    let strike = 0;
    let ball = 0;

    guess.forEach((num, i) => { // num : 사용자가 입력한 숫자 중 하나, forEach()는 자바스크립트 기본 메서드
      if (num === answer[i]) strike++;
      else if (answer.includes(num)) ball++;
    });

    if (strike === 0 && ball === 0) { // 다 틀렸을 때
      return { message: '낫싱', strike, ball };
    }

    let message = ''; // 빈 문자열 선언
    if (ball > 0) message += `${ball}볼 `; // 볼이 하나라면 1볼, 2볼 문자 추가
    if (strike > 0) message += `${strike}스트라이크`; // 볼과 동일한 로직

    return { message: message.trim(), strike, ball }; // 결과를 객체로 리턴해 play()에서 사용할 수 있게 함
  }
}

export default App;
