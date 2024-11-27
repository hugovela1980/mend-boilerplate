import { httpLogger } from "../../../../app/backend/setup/loggerSetup";
import log from "../../../../app/backend/middleware/log";

vi.mock("../../../../app/backend/setup/loggerSetup", () => ({
    httpLogger: vi.fn()
}));

test('logging middleware executes', () => {
    const req = {};
    const res = {};    
    const next = vi.fn();

    log(req, res, next);
    
    expect(httpLogger).toHaveBeenCalledWith(req, res);
    expect(next).toHaveBeenCalledOnce();
});