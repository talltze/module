
/*
 * Duolingo Max
 * Loon Response Script
 */

(function () {
    const done = () => $done({});

    try {
        if (!$response || typeof $response.body !== "string") {
            return done();
        }

        const obj = JSON.parse($response.body);
        const now = Math.floor(Date.now() / 1000);

        function applyGold(userdata) {
            if (!userdata || typeof userdata !== "object") {
                return;
            }

            if (!Array.isArray(userdata.shopItems)) {
                userdata.shopItems = [];
            }

            userdata.shopItems.push({
                id: "gold_subscription",
                purchaseDate: now - 172800,
                purchasePrice: 0,
                subscriptionInfo: {
                    expectedExpiration: now + 31536000,
                    productId: "com.duolingo.DuolingoMobile.subscription.Gold.TwelveMonth.24Q2Max.168",
                    renewer: "APPLE",
                    renewing: true,
                    tier: "twelve_month",
                    type: "gold"
                }
            });

            userdata.subscriberLevel = "GOLD";

            if (
                !userdata.trackingProperties ||
                typeof userdata.trackingProperties !== "object"
            ) {
                userdata.trackingProperties = {};
            }

            const properties = userdata.trackingProperties;

            properties.has_item_immersive_subscription = true;
            properties.has_item_premium_subscription = true;
            properties.has_item_live_subscription = true;
            properties.has_item_gold_subscription = true;
            properties.has_item_max_subscription = true;
        }

        // Batch API
        if (Array.isArray(obj.responses) && obj.responses.length >= 2) {
            const first = obj.responses[0];

            if (!first || !first.body) {
                return done();
            }

            if (
                first.headers &&
                Object.prototype.hasOwnProperty.call(
                    first.headers,
                    "etag"
                )
            ) {
                return done();
            }

            let userdata = first.body;

            if (typeof userdata === "string") {
                userdata = JSON.parse(userdata);
                applyGold(userdata);
                first.body = JSON.stringify(userdata);
            } else {
                applyGold(userdata);
            }

            return $done({
                body: JSON.stringify(obj)
            });
        }

        // User API
        if (
            obj &&
            typeof obj === "object" &&
            (
                obj.shopItems !== undefined ||
                obj.subscriberLevel !== undefined ||
                (obj.id && obj.trackingProperties)
            )
        ) {
            applyGold(obj);

            return $done({
                body: JSON.stringify(obj)
            });
        }

        done();

    } catch (error) {
        console.log("Duolingo Max Error: " + error);
        done();
    }
})();
