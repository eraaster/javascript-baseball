import { Console, Random } from '@woowacourse/mission-utils';

class App {
  async play() {
    Console.print('숫자 야구 게임을 시작합니다.');

    let restart = true;

    while (restart) {
      const answer = this.generateRandomNumbers();
      let correct = false;

      while (!correct) {
        const input = await Console.readLineAsync('숫자를 입력해주세요 : ');

        try {
          this.validate(input);
        } catch (error) {
          Console.print(error.message);
          throw error; // 예외 테스트 통과를 위해 throw 필요
        }

        const guess = input.split('').map(Number);
        const result = this.judge(guess, answer);

        Console.print(result.message);

        if (result.strike === 3) {
          Console.print('3개의 숫자를 모두 맞히셨습니다! 게임 종료');
          const choice = await Console.readLineAsync(
              '게임을 새로 시작하려면 1, 종료하려면 2를 입력하세요.\n'
          );

          if (choice === '1') {
            restart = true;
            correct = true;
          } else if (choice === '2') {
            restart = false;
            correct = true;
          } else {
            throw new Error('[ERROR] 잘못된 입력입니다.');
          }
        }
      }
    }
  }

  generateRandomNumbers() {
    const numbers = [];

    while (numbers.length < 3) {
      const num = Random.pickNumberInRange(1, 9);
      if (!numbers.includes(num)) {
        numbers.push(num);
      }
    }

    return numbers;
  }

  validate(input) {
    if (!/^[1-9]{3}$/.test(input)) {
      throw new Error('[ERROR] 입력은 1~9 사이의 서로 다른 숫자 3자리여야 합니다.');
    }

    const digits = input.split('');
    if (new Set(digits).size !== 3) {
      throw new Error('[ERROR] 숫자는 중복되면 안 됩니다.');
    }
  }

  judge(guess, answer) {
    let strike = 0;
    let ball = 0;

    guess.forEach((num, i) => {
      if (num === answer[i]) strike++;
      else if (answer.includes(num)) ball++;
    });

    if (strike === 0 && ball === 0) {
      return { message: '낫싱', strike, ball };
    }

    let message = '';
    if (ball > 0) message += `${ball}볼 `;
    if (strike > 0) message += `${strike}스트라이크`;

    return { message: message.trim(), strike, ball };
  }
}

export default App;
