contract BaseDropTest is Test {
    BaseDrop drop;
    MockERC20 token;

    function setUp() public {
        token = new MockERC20();
        drop = new BaseDrop();
        token.mint(address(this), 1e24);
    }

    function testCreateAndClaim() public {
        token.approve(address(drop), 1e21);

        uint256 id = drop.createCampaign(
            address(token),
            100 ether,
            10 ether,
            10
        );

        drop.fundCampaign(id, 1000 ether);
        drop.claim(id, address(0));
    }
}
