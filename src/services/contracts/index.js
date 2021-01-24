export default function initServices(
  factory,
  account,
  factoryService,
  fundraiserService
) {
  factoryService.factory = factory;
  factoryService.account = account;
  fundraiserService.account = account;
}
