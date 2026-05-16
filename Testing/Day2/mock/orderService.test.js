jest.mock('./paymentService');
jest.mock('./emailService');

const { placeOrder } = require('./orderService');
const { charge } = require('./paymentService');
const { sendOrderConfirmation } = require('./emailService');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('placeOrder', () => {

  test('returns orderId and transactionId on a successful order', async () => {
    charge.mockResolvedValue({ success: true, transactionId: 'txn_abc123' });
    sendOrderConfirmation.mockResolvedValue({ sent: true });

    const result = await placeOrder('user_1', 'user@test.com', 50);

    expect(result).toHaveProperty('orderId');
    expect(result).toHaveProperty('transactionId', 'txn_abc123');
  });

  test('calls sendOrderConfirmation with the correct email and transactionId', async () => {
    charge.mockResolvedValue({ success: true, transactionId: 'txn_abc123' });
    sendOrderConfirmation.mockResolvedValue({ sent: true });

    await placeOrder('user_1', 'user@test.com', 50);

    expect(sendOrderConfirmation).toHaveBeenCalledTimes(1);
    expect(sendOrderConfirmation).toHaveBeenCalledWith('user@test.com', 'txn_abc123');
  });

  test('throws Invalid amount and never calls charge when amount is 0', async () => {
    await expect(placeOrder('user_1', 'user@test.com', 0))
      .rejects.toThrow('Invalid amount');

    expect(charge).not.toHaveBeenCalled();
  });

});
