import { render, screen } from '@testing-library/react';
import App from './App';
import { reissueAccessToken } from './components/api/axiosApi';

jest.mock('./components/api/axiosApi', () => ({ reissueAccessToken: jest.fn() }));
// 이 테스트는 라우팅 대신 앱 초기 인증 상태 전환을 검증합니다.
jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }) => <>{children}</>,
  Routes: () => null,
  Route: () => null,
}));
jest.mock('./components/header', () => () => <div>인증 복원 완료</div>);
jest.mock('./pages/home', () => () => null);
jest.mock('./pages/login', () => () => null);
jest.mock('./pages/join', () => () => null);
jest.mock('./pages/list', () => () => null);
jest.mock('./pages/detail', () => () => null);
jest.mock('./pages/reservation_create', () => () => null);

test('waits for refresh before rendering the application', async () => {
  reissueAccessToken.mockResolvedValue('restored');
  render(<App />);
  expect(screen.getByRole('status')).toBeInTheDocument();
  expect(await screen.findByText('인증 복원 완료')).toBeInTheDocument();
});

test('renders the application for a visitor without a refresh cookie', async () => {
  reissueAccessToken.mockRejectedValue({ response: { status: 401 } });
  render(<App />);
  expect(await screen.findByText('인증 복원 완료')).toBeInTheDocument();
});

test('shows a retry action when the authentication server is unavailable', async () => {
  reissueAccessToken.mockRejectedValue(new Error('Network Error'));
  render(<App />);
  expect(await screen.findByRole('alert')).toHaveTextContent('로그인 상태를 확인하지 못했습니다.');
  expect(screen.getByRole('button', { name: '다시 시도' })).toBeInTheDocument();
});
