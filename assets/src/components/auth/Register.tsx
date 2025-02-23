import React from 'react';
import {RouteComponentProps, Link} from 'react-router-dom';
import {Box, Flex} from 'theme-ui';
import qs from 'query-string';
import {Button, Input, Text, Title} from '../common';
import {useAuth} from './AuthProvider';
import logger from '../../logger';

type Props = RouteComponentProps<{invite?: string}> & {
  onSubmit: (params: any) => Promise<void>;
};
type State = {
  loading: boolean;
  submitted: boolean;
  companyName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  inviteToken?: string;
  redirect: string;
  error: any;
};

class Register extends React.Component<Props, State> {
  state: State = {
    loading: false,
    submitted: false,
    companyName: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    inviteToken: '',
    redirect: '/getting-started',
    error: null,
  };

  componentDidMount() {
    const {redirect = '/getting-started', email = ''} = qs.parse(
      this.props.location.search
    );
    const {invite: inviteToken} = this.props.match.params;

    this.setState({
      inviteToken,
      email: String(email),
      redirect: String(redirect),
    });
  }

  handleChangeCompanyName = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({companyName: e.target.value});
  };

  handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({email: e.target.value});
  };

  handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({password: e.target.value});
  };

  handleChangePasswordConfirmation = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState({passwordConfirmation: e.target.value});
  };

  getValidationError = () => {
    const {
      companyName,
      email,
      password,
      passwordConfirmation,
      inviteToken,
    } = this.state;

    if (!companyName && !inviteToken) {
      return '请输入团队名';
    } else if (!email) {
      return 'Email is required';
    } else if (!password) {
      return '请输入密码';
    } else if (password.length < 8) {
      return '密码须为8位';
    } else if (password !== passwordConfirmation) {
      return '两次输入密码不一致';
    } else {
      return null;
    }
  };

  handleInputBlur = () => {
    if (!this.state.submitted) {
      return;
    }

    this.setState({error: this.getValidationError()});
  };

  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const error = this.getValidationError();

    if (error) {
      this.setState({error, submitted: true});

      return;
    }

    this.setState({loading: true, submitted: true, error: null});
    const {
      companyName,
      inviteToken,
      email,
      password,
      passwordConfirmation,
      redirect,
    } = this.state;

    this.props
      .onSubmit({
        companyName,
        inviteToken,
        email,
        password,
        passwordConfirmation,
      })
      .then(() => this.props.history.push(redirect))
      .catch((err) => {
        logger.error('Error!', err);
        // TODO: provide more granular error messages?
        const error =
          err.response?.body?.error?.message || 'Invalid credentials';

        this.setState({error, loading: false});
      });
  };

  render() {
    const {location} = this.props;
    const {
      loading,
      inviteToken,
      companyName,
      email,
      password,
      passwordConfirmation,
      error,
    } = this.state;

    return (
      <Flex
        px={[2, 5]}
        py={5}
        sx={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box sx={{width: '100%', maxWidth: 320}}>
          <Title level={1}>注册</Title>
          <form onSubmit={this.handleSubmit}>
            {!inviteToken && (
              <Box mb={2}>
                <label htmlFor="companyName">团队</label>
                <Input
                  id="companyName"
                  size="large"
                  type="text"
                  autoComplete="company-name"
                  value={companyName}
                  onChange={this.handleChangeCompanyName}
                  onBlur={this.handleInputBlur}
                />
              </Box>
            )}

            <Box mb={2}>
              <label htmlFor="email">邮箱</label>
              <Input
                id="email"
                size="large"
                type="email"
                autoComplete="username"
                value={email}
                onChange={this.handleChangeEmail}
                onBlur={this.handleInputBlur}
              />
            </Box>

            <Box mb={2}>
              <label htmlFor="password">密码</label>
              <Input
                id="password"
                size="large"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={this.handleChangePassword}
                onBlur={this.handleInputBlur}
              />
            </Box>

            <Box mb={2}>
              <label htmlFor="confirm_password">确认密码</label>
              <Input
                id="confirm_password"
                size="large"
                type="password"
                autoComplete="current-password"
                value={passwordConfirmation}
                onChange={this.handleChangePasswordConfirmation}
                onBlur={this.handleInputBlur}
              />
            </Box>

            <Box mt={3}>
              <Button
                block
                size="large"
                type="primary"
                htmlType="submit"
                loading={loading}
              >
                注册
              </Button>
            </Box>

            {error && (
              <Box mt={2}>
                <Text type="danger">{error}</Text>
              </Box>
            )}

            <Box mt={error ? 3 : 4}>
              已有账号? <Link to={`/login${location.search}`}>登录</Link>
            </Box>
          </form>
        </Box>
      </Flex>
    );
  }
}

const RegisterPage = (props: RouteComponentProps) => {
  const auth = useAuth();

  return <Register {...props} onSubmit={auth.register} />;
};

export default RegisterPage;
