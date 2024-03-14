import { BadRequestException, NotFoundException } from '@nestjs/common';

import { TestService } from './__fixture__/services';

describe('#crud', () => {
  describe('#CrudService', () => {
    let service: TestService<any>;

    beforeAll(() => {
      service = new TestService();
    });

    describe('#throwBadRequestException', () => {
      it('should throw BadRequestException', () => {
        expect(service.throwBadRequestException.bind(service, '')).toThrowError(
          BadRequestException,
        );
      });
    });

    describe('#throwNotFoundException', () => {
      it('should throw NotFoundException', () => {
        expect(service.throwNotFoundException.bind(service, '')).toThrowError(
          NotFoundException,
        );
      });
    });
    /* retts was here */
    describe('#createPageInfo', () => {
      it('should return an object', () => {
        const expected = {
          data: [],
          pagination: {
            itemFound: 0,
            itemTotal: 100,
            itemPerPage: 10,
            totalPage: 10,
            currentPage: 2,
            //linkPage: links,
          },
          // count: 0,
          // page: 2,
          // pageCount: 10,
          // total: 100,
        };
        expect(service.createPageInfo([], 100, 10, 10)).toMatchObject(expected);
      });

      it('should return an object when limit and offset undefined', () => {
        const expected = {
          data: [],
          pagination: {
            itemFound: 0,
            itemTotal: 100,
            itemPerPage: undefined,
            totalPage: 1,
            currentPage: 1,
            //linkPage: links,
          },
          // count: 0,
          // page: 1,
          // pageCount: 1,
          // total: 100,
        };
        expect(service.createPageInfo([], 100, undefined, undefined)).toMatchObject(
          expected,
        );
      });
    });
  });
});
