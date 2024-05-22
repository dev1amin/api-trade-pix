import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';

const CI_KEY = 'alfatech_1704401086322';
const CS_KEY =
  '1bd2b90fa48a7b07ea50850d4b1c901e8918c590171f2d112e14ea7a506a656f4c4bb42632374e9d8cbb2c638e82e8e3';

interface Payload {
  key: string;
  value: number;
  typeKey: string;
}

@Controller()
export class AppController {
  @Post()
  async create(@Body() createDsaDto: Payload, @Res() retorno: Response) {
    const { key, value, typeKey } = createDsaDto;

    await fetch('https://ws.suitpay.app/api/v1/gateway/pix-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ci: CI_KEY,
        cs: CS_KEY,
      },
      body: JSON.stringify({
        value: value,
        key: key,
        typeKey: typeKey,
      }),
    })
      .then(async (response) => {
        const resp = await response.json();

        return resp;
      })
      .then((respon) => {
        if (respon.response === 'PIX_KEY_NOT_FOUND') {
          return retorno.status(HttpStatus.NOT_FOUND).json(respon);
        }

        if (respon.response === 'UNAUTHORIZED_IP') {
          retorno.status(HttpStatus.BAD_GATEWAY).json(respon);
        }

        if (respon.response === 'OK') {
          return retorno.status(HttpStatus.OK).json(respon);
        }
      });
  }

  @Get('health')
  async health(@Res() res: Response) {
    return res.status(HttpStatus.OK).json('OK');
  }
}
