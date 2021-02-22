import * as fs from 'fs';

export const path = 'log';
export const file = 'log/text.txt';

export function logFileCheck(message: string) {
  fs.readdir(path, function (err) {
    if (err) {
      fs.mkdir(path, '0777', function (err) {
        if (err) {
          console.log('mkdir logs error : ' + JSON.stringify(err));
          process.exit(-1);
        }
        console.log('create logs directory');
      });
    }
  });
  fs.open(file, 'a+', () => {
    fs.appendFile(file, `[${new Date()}] ${message} \n`, function (err) {
      if (err) throw err;
      console.log('The "data to append" was appended to file!');
    });
  });
}
